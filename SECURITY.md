# Security policy

## Reporting a vulnerability

Please do not open a public issue for a security problem. Report it privately on GitHub:
the **Security** tab of this repository → **Report a vulnerability**. Only the maintainers see the
report, and you do not need to share an email address.

A useful report says:

- the version (`anairyspirit --version`) and how it was installed — DMG, Homebrew, npm, Docker,
  `.deb`/`.rpm` or the Linux tarball;
- the platform (macOS on Apple Silicon or Intel, Linux arm64 or x86_64, a container);
- the steps that show the problem, and what an attacker gains.

Do not put your memory's contents, a recovery phrase, a passphrase or an access token into the
report. If a step needs one, describe it instead.

We will confirm that we received the report, tell you what we decided, and credit you in the
release notes of the fix if you want that.

## Supported versions

Security fixes go into the next release. Only the latest release is supported; updating is how a
fix reaches you (`anairyspirit update`, or the way you installed it: Homebrew, npm, a new image).

## What is in scope

- the program and its service: the MCP and REST endpoints, access tokens, TLS, OAuth, LAN access;
- encryption at rest (`none`, `ram`, `stored`), the recovery phrase, backups, export and import;
- the installers and updates: DMG, Homebrew formula, npm launcher, Docker image, Linux packages;
- release signatures ([KEYS](KEYS));
- the hooks and client settings the program writes for your agents.

Not in scope: what your agent sends to its own model provider. A memory that runs on your machine
gives the agent what it finds; where the agent forwards that is decided by the agent and its
provider, not by this program.

The source code is not published. Please test only against an installation you own.
