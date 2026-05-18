# Release Policy

WebStreamr Legacy does not publish automatic releases from every `main` push.
The fork is still establishing its community maintenance baseline, and the npm
package is marked private, so releases are GitHub source releases only until a
separate package or image publishing plan is agreed.

## Current Release Flow

1. Keep normal build, CI, and test workflows green on `main`.
2. Make maintenance changes through reviewed pull requests.
3. Run the `Release Please` workflow manually from GitHub Actions when a
   maintainer wants to prepare a community release.
4. Review the generated release pull request and changelog before merging it.
5. Publish Docker images or package artifacts only after their namespace and
   credentials are documented in a separate issue.

## First Community Release Checklist

- Confirm source and extractor health notes are current.
- Confirm Windows and Linux CI pass on Node 22 and 24.
- Confirm the Docker image namespace decision is documented.
- Confirm `CHANGELOG.md`, `package.json`, `.release-please-manifest.json`, and
  `src/utils/manifest.ts` versions agree in the generated release pull request.
- Label the release as a community-maintained continuation, not an official
  upstream takeover.
