/* istanbul ignore file */
import crypto from 'crypto';
import fs from 'node:fs';
import path from 'node:path';
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import slugify from 'slugify';
import winston from 'winston';
import { NotFoundError } from '../error';
import { Context } from '../types';
import { envGet } from './env';
import { CustomRequestConfig, Fetcher } from './Fetcher';

type FixtureKind = 'error' | 'response';

interface FixtureManifestEntry {
  data?: string;
  file: string;
  kind: FixtureKind;
  legacyFile?: string;
  method: string;
  url: string;
}

interface FixtureManifest {
  entries: Record<string, FixtureManifestEntry>;
  version: 1;
}

interface FixtureReference {
  data?: string;
  errorFile: string;
  errorPath: string;
  file: string;
  key: string;
  legacyErrorPath: string;
  legacyFile: string;
  legacyPath: string;
  method: string;
  path: string;
  url: string;
}

interface StoredFixture {
  kind: FixtureKind;
  path: string;
}

export class FetcherMock extends Fetcher {
  private readonly fixturePath: string;
  private manifest: FixtureManifest | undefined;

  public constructor(fixturePath: string) {
    super(axios, winston.createLogger({ transports: [new winston.transports.Console({ level: 'nope' })] }));

    this.fixturePath = fixturePath;
  }

  public override async fetch(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<AxiosResponse> {
    return this.fetchInternal(this.fixtureFor(url, requestConfig), ctx, url, requestConfig);
  };

  public override async text(ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<string> {
    return (await this.fetchInternal(this.fixtureFor(url, requestConfig), ctx, url, requestConfig)).data;
  };

  public override async textPost(ctx: Context, url: URL, data: string, requestConfig?: CustomRequestConfig): Promise<string> {
    return (await this.fetchInternal(this.fixtureFor(url, { ...requestConfig, method: 'POST', data }), ctx, url, { ...requestConfig, method: 'POST', data })).data;
  };

  public override async head(ctx: Context, url: URL, init?: CustomRequestConfig): Promise<AxiosResponse['headers']> {
    return (await this.fetchInternal(this.fixtureFor(url, { ...init, method: 'HEAD' }), ctx, url, { ...init, method: 'HEAD' })).headers;
  };

  public override async getFinalRedirectUrl(ctx: Context, url: URL, requestConfig?: CustomRequestConfig, maxCount?: number, count?: number): Promise<URL> {
    const newRequestConfig = { ...requestConfig, method: 'HEAD', maxRedirects: 0 };

    if (count && maxCount && count >= maxCount) {
      return url;
    }

    const response = await this.fetch(ctx, url, newRequestConfig);
    if (response.headers['location']) {
      return await this.getFinalRedirectUrl(ctx, new URL(response.headers['location']), newRequestConfig, maxCount, (count ?? 0) + 1);
    }

    return url;
  }

  private readonly fixtureFor = (url: URL, requestConfig?: CustomRequestConfig): FixtureReference => {
    const method = (requestConfig?.method ?? 'GET').toUpperCase();
    const data = method === 'POST' ? `${requestConfig?.data ?? ''}` : undefined;
    const keyPayload = data === undefined ? { method, url: url.href } : { data, method, url: url.href };
    const key = crypto.createHash('sha256').update(JSON.stringify(keyPayload)).digest('hex');
    const file = `${key}.response.txt`;
    const errorFile = `${key}.error.txt`;
    const legacyFile = this.legacyFixtureFile(url, method, data);
    const reference: FixtureReference = {
      errorFile,
      errorPath: path.join(this.fixturePath, errorFile),
      file,
      key,
      legacyErrorPath: path.join(this.fixturePath, `${legacyFile}.error`),
      legacyFile,
      legacyPath: path.join(this.fixturePath, legacyFile),
      method,
      path: path.join(this.fixturePath, file),
      url: url.href,
    };

    if (data !== undefined) {
      reference.data = data;
    }

    return reference;
  };

  private readonly legacyFixtureFile = (url: URL, method: string, data?: string): string => {
    if (method === 'POST') {
      return `post-${this.slugifyUrl(url)}-${slugify(data ?? '')}`;
    }

    if (method === 'HEAD') {
      return `head-${this.slugifyUrl(url)}`;
    }

    return this.slugifyUrl(url);
  };

  private readonly slugifyUrl = (url: URL): string => {
    const slugifiedUrl = slugify(url.href);

    if (slugifiedUrl.length > 249) {
      return slugify(`${url.origin}-${crypto.createHash('md5').update(url.href).digest('hex')}`);
    }

    return slugifiedUrl;
  };

  private readonly fetchInternal = async (fixture: FixtureReference, ctx: Context, url: URL, requestConfig?: CustomRequestConfig): Promise<AxiosResponse> => {
    const isHead = requestConfig?.method === 'HEAD';
    const storedFixture = this.findStoredFixture(fixture);

    if (storedFixture) {
      return this.readStoredFixture(storedFixture, isHead);
    }

    let response;
    try {
      if (envGet('TEST_UPDATE_FIXTURES')) {
        response = await super.fetchWithTimeout(ctx, url, requestConfig);
      } else {
        console.error(`No fixture found for ${fixture.method} ${fixture.url}. Expected ${fixture.path}.`);
        process.exit(1);
      }
    } catch (error) {
      this.writeFixture(fixture, 'error', `${error}`);
      throw error;
    }

    if (response.status < 200 || response.status > 399) {
      const message = `Fetcher error: ${response.status}: ${response.statusText}`;
      this.writeFixture(fixture, 'error', message);
      throw new Error(message);
    }

    let result;
    if (isHead) {
      result = JSON.stringify(response.headers);
    } else {
      result = response.data;
    }

    this.writeFixture(fixture, 'response', result);

    return {
      data: isHead ? '' : result,
      headers: isHead ? JSON.parse(result) : {},
      status: 200,
      statusText: 'OK',
      config: { } as InternalAxiosRequestConfig,
    };
  };

  private readonly findStoredFixture = (fixture: FixtureReference): StoredFixture | undefined => {
    const manifestEntry = this.loadManifest().entries[fixture.key];
    if (manifestEntry) {
      const manifestPath = path.join(this.fixturePath, manifestEntry.file);
      if (fs.existsSync(manifestPath)) {
        return { kind: manifestEntry.kind, path: manifestPath };
      }
    }

    if (fs.existsSync(fixture.errorPath)) {
      return { kind: 'error', path: fixture.errorPath };
    }

    if (fs.existsSync(fixture.path)) {
      return { kind: 'response', path: fixture.path };
    }

    if (fs.existsSync(fixture.legacyErrorPath)) {
      return this.migrateLegacyFixture(fixture, 'error');
    }

    if (fs.existsSync(fixture.legacyPath)) {
      return this.migrateLegacyFixture(fixture, 'response');
    }

    return undefined;
  };

  private readonly readStoredFixture = (fixture: StoredFixture, isHead: boolean): AxiosResponse => {
    const data = fs.readFileSync(fixture.path).toString();

    if (fixture.kind === 'error') {
      if (data.includes('404: Not Found')) {
        throw new NotFoundError(data);
      }

      throw new Error(data);
    }

    return {
      data: isHead ? '' : data,
      headers: isHead ? JSON.parse(data) : {},
      status: 200,
      statusText: 'OK',
      config: { } as InternalAxiosRequestConfig,
    };
  };

  private readonly migrateLegacyFixture = (fixture: FixtureReference, kind: FixtureKind): StoredFixture => {
    const sourcePath = kind === 'error' ? fixture.legacyErrorPath : fixture.legacyPath;
    const targetFile = kind === 'error' ? fixture.errorFile : fixture.file;
    const targetPath = path.join(this.fixturePath, targetFile);
    const legacyFile = kind === 'error' ? `${fixture.legacyFile}.error` : fixture.legacyFile;

    fs.mkdirSync(this.fixturePath, { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
    this.upsertManifest(fixture, kind, targetFile, legacyFile);

    return { kind, path: targetPath };
  };

  private readonly writeFixture = (fixture: FixtureReference, kind: FixtureKind, content: string): void => {
    const file = kind === 'error' ? fixture.errorFile : fixture.file;
    const targetPath = path.join(this.fixturePath, file);

    fs.mkdirSync(this.fixturePath, { recursive: true });
    fs.writeFileSync(targetPath, content);
    this.upsertManifest(fixture, kind, file);
  };

  private readonly upsertManifest = (fixture: FixtureReference, kind: FixtureKind, file: string, legacyFile?: string): void => {
    const manifest = this.loadManifest();
    const entry: FixtureManifestEntry = {
      file,
      kind,
      method: fixture.method,
      url: fixture.url,
    };

    if (fixture.data !== undefined) {
      entry.data = fixture.data;
    }

    if (legacyFile !== undefined) {
      entry.legacyFile = legacyFile;
    }

    manifest.entries[fixture.key] = entry;
    this.writeManifest(manifest);
  };

  private readonly loadManifest = (): FixtureManifest => {
    if (this.manifest) {
      return this.manifest;
    }

    const manifestPath = this.manifestPath();
    if (!fs.existsSync(manifestPath)) {
      this.manifest = { entries: {}, version: 1 };
      return this.manifest;
    }

    this.manifest = JSON.parse(fs.readFileSync(manifestPath).toString()) as FixtureManifest;
    return this.manifest;
  };

  private readonly writeManifest = (manifest: FixtureManifest): void => {
    const sortedEntries = Object.fromEntries(Object.entries(manifest.entries).sort(([a], [b]) => a.localeCompare(b)));
    const sortedManifest: FixtureManifest = { entries: sortedEntries, version: 1 };

    fs.mkdirSync(this.fixturePath, { recursive: true });
    fs.writeFileSync(this.manifestPath(), `${JSON.stringify(sortedManifest, null, 2)}\n`);
    this.manifest = sortedManifest;
  };

  private readonly manifestPath = (): string => path.join(this.fixturePath, 'manifest.json');
}
