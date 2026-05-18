# Contributing To WebStreamr Legacy

Thanks for helping keep WebStreamr usable for self-hosters.

WebStreamr Legacy is a community-maintained continuation of an archived MIT
project. Keep all upstream attribution and license text intact. Do not claim
official ownership or affiliation unless the original maintainer explicitly
grants it.

## Ground Rules

- Keep changes small, reviewable, and covered by tests where practical.
- Prefer source/extractor fixes over broad rewrites.
- Do not commit API keys, cookies, private URLs, session headers, or hosted
  operator details.
- Do not add a public media relay mode by default. Self-hosted operators should
  explicitly choose any byte-relay behavior.
- Use neutral addon terms: route, source, stream row, media host, sidecar,
  adapter, and cache.
- Avoid adding dependencies unless they replace fragile custom code or clearly
  reduce maintenance load.

## Local Setup

```bash
npm ci
npm run build
npm test
```

The CI baseline targets Node 22 and Node 24 on Linux. Windows contributors
should read `WINDOWS_FIXTURE_PATHS.md` before cloning because some archived
fixture filenames are not portable to a normal Windows checkout.

## Pull Request Checklist

- Existing MIT attribution is preserved.
- New behavior has a focused test or a written reason why it cannot be tested.
- Source/extractor changes include sanitized fixtures when possible.
- Public docs do not include private service names, credentials, or deployment
  secrets.
- The change has been checked on Node 22 or Node 24.

