# Security Policy

## Supported Versions

WebStreamr Legacy supports the latest published community-maintained release.
Archived upstream releases are not supported by this policy.

## Reporting A Vulnerability

Please report security issues privately by opening a GitHub security advisory
on the public fork, or by using the maintainer contact listed in that fork.

Do not post the following in public issues:

- API keys, cookies, credentials, tokens, or private endpoint URLs;
- private deployment logs that include client IPs or secrets;
- working exploit steps that would expose a self-hosted instance;
- details of an unpublished source bypass.

## Project Security Boundaries

WebStreamr Legacy should remain a metadata and stream-discovery service by
default. It should not become an open public media relay. Operators who enable
proxying or byte relay behavior are responsible for rate limits, access control,
logging policy, and abuse handling.

The project should treat all upstream source responses as untrusted input:

- validate URLs before emitting them;
- avoid forwarding secrets to third-party hosts;
- keep request headers scoped to the source that needs them;
- redact credentials from errors and logs.

