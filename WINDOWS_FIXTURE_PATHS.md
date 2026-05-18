# Windows Fixture Path Notes

The archived WebStreamr repository used recorded fixture filenames derived from
URLs. Some names included characters such as `:` and very long encoded paths.
Those paths were valid on Linux but failed in a normal Windows checkout.

WebStreamr Community now stores recorded fixtures as portable hash-named files
with a `manifest.json` beside each fixture group. The manifest preserves the
request metadata that used to be implied by the filename.

Example fixture layout:

```text
src/extractor/__fixtures__/FileMoon/
  7f3a0f2c.response.txt
  manifest.json
```

Manifest entries include:

- HTTP method;
- original URL;
- POST data, when present;
- response or error fixture file;
- legacy filename, when migrated from the archived layout.

## Windows Workflow

A normal checkout should work on Windows after the portable fixture migration:

```bash
git clone https://github.com/webstreamr-community/webstreamr.git
cd webstreamr
npm ci
npm run analyse
npm test
```

The Docker build workflow remains Linux-focused, but CI includes Windows for
checkout, install, TypeScript analysis, and tests so filename portability stays
covered.

## Updating Fixtures

`FetcherMock` writes new fixtures through the same manifest-backed format. Use
`npm run test:update-fixtures` on Linux when refreshing live recordings, then
review the generated manifest and response files before committing.

Do not reintroduce raw URL-derived fixture filenames. They make the repository
harder to clone and review on Windows.