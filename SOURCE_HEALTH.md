# Source And Extractor Health

This matrix is a maintenance aid for WebStreamr Legacy. It separates recorded
fixture coverage from live smoke evidence because upstream sites and media hosts
change without notice.

## Status Key

- `passing`: verified by the recorded fixture test suite.
- `failing`: verified failing in the recorded fixture test suite.
- `missing`: no dedicated fixture test was found.
- `not checked`: no current live smoke evidence has been recorded.
- `blocked`: smoke probe could not reach upstream host from this check environment
  (DNS/socket restrictions).

## Baseline

- Fixture baseline: `npm test` passed on Node 24 Linux on 2026-05-20.
- Fixture scope: 54 test suites, 212 tests, 166 snapshots.
- Live smoke baseline: blocked by local environment network restrictions during this pass
  (no outbound DNS/socket access for upstream hosts).
- Runtime baseline: a normal self-hosted instance requires `TMDB_ACCESS_TOKEN`.
- Do not add private endpoints, credentials, or user-specific manifests to this
  document.

## Sources

| Source | ID | Content | Regions | Fixture tests | Live smoke | Last checked | Notes |
|---|---:|---|---|---|---|---|---|
| 4KHDHub | `4khdhub` | movie, series | multi, hi, ta, te | passing | not checked | fixture 2026-05-20 | Upstream route likely changes; verify with fresh title search before claiming live support. |
| CineHDPlus | `cinehdplus` | series | es, mx | passing | blocked | fixture 2026-05-20 | Blocked by environment: outbound socket/DNS access unavailable in local smoke probe. |
| Cuevana | `cuevana` | movie, series | es, mx | passing | blocked | fixture 2026-05-20 | Blocked by environment: outbound socket/DNS access unavailable in local smoke probe. |
| Einschalten | `einschalten` | movie | de | passing | not checked | fixture 2026-05-20 | Movie-only German source. |
| Eurostreaming | `eurostreaming` | series | it | passing | not checked | fixture 2026-05-20 | Series-only Italian source. |
| Frembed | `frembed` | movie, series | fr | passing | not checked | fixture 2026-05-20 | French source. |
| FrenchCloud | `frenchcloud` | movie | fr | passing | not checked | fixture 2026-05-20 | Movie-only French source. |
| HDHub4u | `hdhub4u` | movie, series | multi, gu, hi, ml, pa, ta, te | passing | not checked | fixture 2026-05-20 | Route-sensitive source; verify current host before marking live. |
| HomeCine | `homecine` | movie, series | es, mx | passing | blocked | fixture 2026-05-20 | Blocked by environment: outbound socket/DNS access unavailable in local smoke probe. |
| KinoGer | `kinoger` | movie, series | de | passing | not checked | fixture 2026-05-20 | German source; also has a media extractor. |
| Kokoshka | `kokoshka` | movie, series | al | passing | not checked | fixture 2026-05-20 | Albanian source. |
| MegaKino | `megakino` | movie | de | passing | not checked | fixture 2026-05-20 | Movie-only German source. |
| MeineCloud | `meinecloud` | movie | de | passing | not checked | fixture 2026-05-20 | Movie-only German source. |
| MostraGuarda | `mostraguarda` | movie | it | passing | not checked | fixture 2026-05-20 | Movie-only Italian source. |
| Movix | `movix` | movie, series | fr | passing | blocked | fixture 2026-05-20 | Blocked by environment: API hostname lookup/socket access blocked in local smoke probe. |
| RgShows | `rgshows` | movie, series | multi | passing | not checked | fixture 2026-05-20 | Known to detect shared usage and block IPs; treat live health as private-instance dependent. |
| StreamKiste | `streamkiste` | series | de | passing | not checked | fixture 2026-05-20 | Series-only German source. |
| VerHdLink | `verhdlink` | movie | es, mx | passing | blocked | fixture 2026-05-20 | Blocked by environment: outbound socket/DNS access unavailable in local smoke probe. |
| VidSrc | `vidsrc` | movie, series | multi | passing | not checked | fixture 2026-05-20 | Known to rate-limit heavily; keep as fallback unless live evidence says otherwise. |
| VixSrc | `vixsrc` | movie, series | multi, it | passing | not checked | fixture 2026-05-20 | Multi/Italian source; also has a media extractor. |

## Extractors

| Extractor | ID | Fixture tests | Live smoke | Last checked | Environment / notes |
|---|---:|---|---|---|---|
| DoodStream | `doodstream` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support in the current implementation. |
| Dropload | `dropload` | passing | not checked | fixture 2026-05-20 | Direct extractor. |
| External URL | `external` | passing | not checked | fixture 2026-05-20 | Fallback extractor; not host-specific. |
| Fastream | `fastream` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support. |
| FileLions | `filelions` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support. |
| FileMoon | `filemoon` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support. |
| Fsst | `fsst` | passing | not checked | fixture 2026-05-20 | Direct extractor. |
| HubCloud | `hubcloud` | passing | not checked | fixture 2026-05-20 | Shared by HubDrive flows. |
| HubDrive | `hubdrive` | passing | not checked | fixture 2026-05-20 | Depends on HubCloud extraction path. |
| KinoGer | `kinoger` | passing | not checked | fixture 2026-05-20 | Direct extractor for KinoGer media URLs. |
| LuluStream | `lulustream` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support. |
| Mixdrop | `mixdrop` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support. |
| RgShows | `rgshows` | passing | not checked | fixture 2026-05-20 | Live behavior may depend on private-instance IP reputation. |
| SaveFiles | `savefiles` | passing | not checked | fixture 2026-05-20 | Direct extractor. |
| StreamEmbed | `streamembed` | passing | not checked | fixture 2026-05-20 | Direct extractor. |
| Streamtape | `streamtape` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support. |
| SuperVideo | `supervideo` | passing | not checked | fixture 2026-05-20 | Direct extractor; Android playback can be sensitive to `Referer` handling. |
| Uqload | `uqload` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support. |
| VidSrc | `vidsrc` | passing | not checked | fixture 2026-05-20 | Known to rate-limit heavily. |
| Vidora | `vidora` | passing | not checked | fixture 2026-05-20 | Direct extractor. |
| VixSrc | `vixsrc` | passing | not checked | fixture 2026-05-20 | Direct extractor. |
| VOE | `voe` | passing | not checked | fixture 2026-05-20 | Requires MediaFlow proxy support. |
| YouTube | `youtube` | passing | not checked | fixture 2026-05-20 | Direct extractor for YouTube URLs. |

## Updating Live Smoke Status

When live checks are added, record only public-safe facts:

1. Use a clean self-hosted WebStreamr instance or a documented local run.
2. Record the date, title type, and generic ID shape, such as movie IMDb ID or
   series IMDb ID plus season/episode.
3. Mark the source or extractor as passing only when it returns usable URLs or a
   clearly expected fallback response.
4. Mark failures with short reasons such as timeout, blocked, changed DOM,
   captcha, host redirect, rate limit, or unsupported media host.
5. Do not publish private deployment hostnames, access URLs, API tokens, proxy
   addresses, or user-specific manifests.
