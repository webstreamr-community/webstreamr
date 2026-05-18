# Windows Fixture Path Notes

The archived WebStreamr repository contains recorded fixtures whose filenames
are derived from URLs. Some names include characters such as `:` and very long
encoded paths. Those paths are normal on Linux but can fail in a standard
Windows checkout.

## Recommended Windows Workflows

Use one of these options:

- develop inside WSL2 or a Linux container;
- clone on a Linux filesystem and run tests there;
- for docs-only work on Windows, avoid a full checkout and explicitly restore
  only portable paths.

Docs-only Windows checkout example:

```bash
git clone --no-checkout https://github.com/<owner>/webstreamr-legacy.git
cd webstreamr-legacy
git checkout HEAD -- README.md LICENSE.txt package.json package-lock.json .github
```

A sparse checkout that excludes `src/**/__fixtures__/**` may still fail on some
Git for Windows versions because the checkout can touch invalid fixture paths
before the exclusion is fully applied. Treat Linux CI as the authority for full
source builds and tests until the fixture naming scheme is migrated.

## Future Fix

A portable fixture migration should replace raw URL-derived filenames with a
stable hash plus a small manifest, for example:

```text
src/extractor/__fixtures__/FileMoon/
  7f3a0f2c.response.html
  manifest.json
```

The manifest can map the original URL, HTTP method, status, headers, and body
file. That keeps fixtures reviewable while avoiding Windows-invalid filenames.