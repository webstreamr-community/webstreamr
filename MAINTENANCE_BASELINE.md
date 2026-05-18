# Maintenance Baseline

Use this checklist for the first WebStreamr Legacy public fork pass.

## Repository Hygiene

- Keep `LICENSE.txt` and upstream copyright notices.
- Add README non-affiliation language.
- Add `SECURITY.md`, `SUPPORT.md`, and `CONTRIBUTING.md`.
- Add Node 22/24 Linux CI.
- Add issue templates for bugs and source/extractor requests.
- Document the Windows fixture path problem.
- Pause automatic releases until the first community release policy is ready.
- Confirm Docker self-host instructions use WebStreamr's default `51546` port.

## First Technical Pass

- Run `npm ci`.
- Run `npm run build`.
- Run `npm test`.
- Record any failing archived fixtures without deleting them.
- Check that the Docker image boots and serves `/health` or the nearest
  existing lightweight status route.
- Keep the `Release Please` workflow manual-only until Docker/package
  publishing is explicitly documented.
- Add a short maintenance note to the changelog.

## Public Reputation Path

- Publish the maintenance baseline before asking hosts for support.
- Keep the first announcement factual: archived project continuity, self-host
  focus, CI restored, support/security policy added.
- After a private sidecar adoption story is proven, prepare a short ElfHosted
  outreach note that points to the public fork health, not private downstream details.
- A Hugging Face Docker Space can be added later as a self-host demo, but it
  should be labeled as a sleeping/free demo and not as production hosting.
