# anairyspirit

A personal AI memory graph that runs on your own machine. Your AI agents keep
long-term memory in it over MCP and REST; nothing leaves the machine.

This package installs it and runs it — macOS and Linux (x86_64, arm64), Node 18
or newer. It carries no program itself: it downloads the release it was built
for from GitHub and checks it against the checksums of that release's signed
manifest before anything runs.

## Install

```bash
npx anairyspirit setup
```

`setup` asks about encryption and the rest, installs the program as
`anairyspirit` (in `/usr/local/bin`, or `~/.local/bin` — then open a new
terminal) and starts its service.

## Use it from an AI client

Once installed, every command goes to the installed program, so an MCP client
can start it like this:

```json
{ "command": "npx", "args": ["-y", "anairyspirit", "mcp"] }
```

## Update

```bash
npx anairyspirit@latest update
```

installs the newest release over yours — your memory, settings and keys stay.
An install made by Homebrew or a package is updated the way it came; the
program says how.

## Installed with `npm i -g`

The command is then `anairyspirit-npm` (the program itself is `anairyspirit`,
and the two must not share a name): `anairyspirit-npm setup`,
`anairyspirit-npm update`.

Other ways to install — a macOS disk image, Homebrew, Debian/Ubuntu and
Fedora/openSUSE packages, Docker — and the manual:
https://github.com/Seventhwalllab/anairyspirit

The program and this package are distributed under the An Airy Spirit End-User
Licence Agreement: `LICENSE` and `EULA.txt` in this package, shown again by
`setup`.
