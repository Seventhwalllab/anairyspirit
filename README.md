<img src="assets/icon.png" width="168" height="168" alt="An Airy Spirit">

# An Airy Spirit

**Your agent's own memory. Experience that outlives the session.**

[![Made by Seventh Wall Lab](https://img.shields.io/badge/made_by-Seventh_Wall_Lab-1f2328?style=for-the-badge)](https://seventhwalllab.com)
[![Release](https://img.shields.io/github/v/release/Seventhwalllab/anairyspirit?include_prereleases&sort=semver&style=for-the-badge&label=release&color=e8743b)](https://github.com/Seventhwalllab/anairyspirit/releases)
[![License](https://img.shields.io/badge/license-EULA-5b8c3a?style=for-the-badge)](LICENSE)
[![Platforms](https://img.shields.io/badge/runs_on-macOS_·_Linux_·_Docker-3d5a80?style=for-the-badge)](#works-with)

[![Rust](https://img.shields.io/badge/written_in-Rust-b7410e?style=for-the-badge&logo=rust&logoColor=white)](#under-the-hood)
[![MCP](https://img.shields.io/badge/MCP-server-1f2328?style=for-the-badge&logo=modelcontextprotocol&logoColor=white)](#works-with)
[![Agent memory](https://img.shields.io/badge/agent-memory-6a4c93?style=for-the-badge)](onboarding/)
[![Graph memory](https://img.shields.io/badge/memory-graph-6a4c93?style=for-the-badge)](#what-it-gives-the-agent)
[![Local-first](https://img.shields.io/badge/local--first-no_cloud_·_no_telemetry-2a7f62?style=for-the-badge)](#your-data)
[![Encryption](https://img.shields.io/badge/encryption-ChaCha20--Poly1305-2a7f62?style=for-the-badge)](#your-data)
[![ONNX Runtime](https://img.shields.io/badge/ONNX-Runtime-3d5a80?style=for-the-badge&logo=onnx&logoColor=white)](#under-the-hood)

Every session, an AI agent starts from zero. The corrections it earned yesterday,
the mistakes it already made, what it learned about how you work — gone with the
context window. An Airy Spirit gives the agent a memory of its own, on your
machine, so that experience accumulates instead of evaporating.

Not a store of documents about your project — your repository already holds
those. A record of how the agent itself works: where it tends to be wrong, which
corrections it was given and why, what it decided and what came of it.

The memory is a graph that lives the way memory does. New material settles into
connections during sleep; what goes unused dims — it is never deleted, and it
rises again when it is needed, because an approach that was wrong a month ago may
be right under today's conditions. Over time the agent comes to hold positions
rather than a readiness to agree. Our aim — a goal, not a claim — is that
experience, kept long enough, becomes a self.

One program, written in Rust from the storage engine up. No cloud, no LLM, no
interpreter.

## Why not files

Your agent already reads files at startup — `CLAUDE.md`, `AGENTS.md`, a folder of
analysis. They answer *how this code is built*. Memory answers *how the agent is
built*.

- **Calibration, not knowledge.** "I conclude something is absent after failing to
  find it on the first pass" is not a fact about any file. It is a fact about the
  agent, and it fires every time.
- **A correction is earned, not spent.** The agent decides what is worth keeping
  and writes it down; remembered once, it is there in every session after.
  Nothing is harvested from the conversation wholesale.
- **Experience crosses projects.** Patterns of behaviour are recognised wherever
  they recur — in another repository, another language, another goal. A file
  stays in the repository it was written in.
- **It moves as one piece.** Copy it, encrypt it, carry it to a server or a
  container: on the new machine it is the same memory, not a hundred scattered
  files that are "roughly the same, I think".
- **Forgetting is designed in.** What is used rises, what is not dims, and a
  place in long-term memory is earned. The agent's own replies leave short-lived
  episodic traces; sleep keeps the few that prove valuable and lets the rest go.
  What the agent chose to write itself stays.

The whole argument, written for the agent itself, is in
[onboarding/](onboarding/) — in English, Spanish, French, Brazilian Portuguese,
Russian and Traditional Chinese.

## What it gives the agent

**Recall by connection, not by keyword.** Every memory is a node, and edges carry
meaning: similarity, contradiction, supersession, part of a whole. A query starts
from the direct matches and spreads along the edges to their neighbours, so "what
did we decide about X" is found through what it is connected to.

**Consolidation while idle.** A light sleep runs on its own as material arrives.
A deep sleep — the one that groups memories into topics and finds how they
relate — runs by itself when it is due and the
machine is idle, once automatic deep sleep is on (one click in the menu bar);
until then the agent is told when it is due. A deep sleep is all or nothing: if
it fails halfway, the memory is exactly as it was before it began.

**Two dates on every memory.** When the thing happened, and when the agent wrote
it down. So "last week" finds what happened last week, even if it was recorded
today.

**People and things.** Names of people, projects and places are picked out
automatically, and a name spelled two ways stays one person instead of becoming
two.

**Search that explains itself.** Any search can show its work: what each step
found, how long it took, and why the results came out in that order.

## Your data

- **On your disk.** Everything lives in one folder. A crash or a power cut loses
  nothing that was already written.
- **No cloud, no LLM.** Models download once at setup (about 1.5 GB; an offline
  install is supported). After that nothing leaves the machine. No telemetry.
- **Encrypted if you want it.** Three modes: none; passphrase asked at every start
  and held in memory only; passphrase on disk for unattended boot. Switch between
  them at any time; the data stays.
- **Recoverable by you alone.** Every install gets its own 24-word recovery phrase,
  generated locally. It lifts an emergency stop and resets a forgotten passphrase.
- **Stoppable.** An emergency stop in three strengths; the strongest survives a
  restart, and only the recovery phrase lifts it.
- **Portable.** One encrypted file carries the whole memory to another machine.

## Works with

**Agents:** Claude Code, Claude Desktop, Gemini CLI, Antigravity, Codex, Cursor,
Grok, Kiro — connected over MCP; where the agent supports it, memory is also brought into
the conversation at the start of a session. Any other MCP client works with a
manual config.

**Platforms:** macOS 11+ (Apple Silicon and Intel, one universal app); Linux
x86_64 and arm64 (`.deb`, `.rpm`, `.tar.gz`; glibc 2.34+); Docker (amd64, arm64).

**Machine:** about 2 GB of RAM while running and 1.5 GB of disk for the models. On
a machine with 16 GB or more, search orders its results with a larger, more
accurate model.

**Languages**

| what | languages |
|---|---|
| remembering and searching by meaning | 100+ — multilingual embeddings and reranker |
| time phrases in a query ("last week", "вчера"), auto-tagging, contradiction cues | English, Russian, German, Spanish, French, Portuguese |
| the onboarding text for the agent, the licence agreement | English, Spanish, French, Brazilian Portuguese, Russian, Traditional Chinese |
| the program itself — command line, full-screen console, menu bar, built-in manual | English |

## Install

| platform | |
|---|---|
| macOS | open the disk image and the app — it walks you through setup |
| Homebrew (macOS, Linux) | `brew tap seventhwalllab/anairyspirit https://github.com/Seventhwalllab/anairyspirit && brew trust seventhwalllab/anairyspirit && brew install anairyspirit && anairyspirit setup` — needs a Homebrew that works on your system: on macOS, Command Line Tools that support your macOS version and a current git (`brew doctor` says so) |
| Debian, Ubuntu | `sudo apt install ./anairyspirit-cli_<version>-1_<arch>.deb && anairyspirit setup` |
| Fedora, RHEL | `sudo dnf install ./anairyspirit-cli-<version>-1.<arch>.rpm && anairyspirit setup` |
| openSUSE | `sudo rpm --import https://raw.githubusercontent.com/Seventhwalllab/anairyspirit/main/KEYS && sudo zypper install ./anairyspirit-cli-<version>-1.<arch>.rpm && anairyspirit setup` — zypper checks the package signature, so the key comes first |
| any other Linux | unpack the `.tar.gz`, then `./anairyspirit setup` |
| Docker | download `anairyspirit-<version>-docker-<arch>.tar` from the release, `docker load -i` it, then run the image with a data volume |

Every release carries a GPG-signed checksum manifest (`SHA256SUMS-public.asc`,
key in [KEYS](KEYS)). The manual ships with each release in `docs/` and inside the
program: `anairyspirit man`.

## FinOps

What the service takes, for a memory of about 12 thousand records. **We strongly
recommend at least 5 GB of memory.** Figures are High / Balanced — the two search
qualities in the menu-bar app.

| | M1 | M3 Ultra | Docker arm64 | Intel i7 |
|---|---|---|---|---|
| memory, idle | 2.7 / 2.4 GB | 4.2 / 3.7 GB | 3.8 / 3.5 GB | — / 1.9 GB |
| memory, consolidation peak | 2.9 / 2.6 GB | 3.7 / 3.8 GB | 5.2 / 4.8 GB | — / 2.1 GB |
| search | 3.5 / 1.5 s | 1.4 / 0.8 s | 3.8 / 1.7 s | — / 5.4 s |

The full figures, disk use and which quality to choose: [docs/FINOPS.md](docs/FINOPS.md).

## Under the hood

**Written in Rust, from the storage engine up** — about 290,000 lines: the graph
store, vector index, search pipeline, encryption, the service, the command line,
the menu bar and the setup windows. No Python, no JVM, no interpreter at runtime.
The one exception is a 380-line Node bridge that Claude Desktop's extension format
requires; the program writes it out when you connect that client.

| layer | built with |
|---|---|
| core | Rust. One program is the service, the command line, the MCP server and the menu bar. No LLM, no cloud API |
| storage | own graph engine: mmap snapshot + write-ahead log, crash-safe by replay |
| encryption | ChaCha20-Poly1305 at the file level, key derived from a passphrase with Argon2id |
| vectors | BGE-M3 (multilingual) via ONNX Runtime |
| vector storage | Extended RaBitQ — about 8× compression, no codebook to train or ship (Gao et al., SIGMOD 2025) |
| nearest neighbours | HNSW, own implementation (Malkov & Yashunin, 2016) |
| retrieval | a pipeline of stages you compose in settings, not a fixed recipe: dense similarity, lexical scoring (Okapi BM25), rank fusion, spreading activation over the graph (Collins & Loftus, 1975), community structure, cross-encoder reranking. The default recipe uses four of these, spreading activation among them; the rest are one settings line away |
| ranking by use | ACT-R base-level activation — what is reached for often stays reachable (Anderson & Schooler, 1991). Opt-in |
| associations | Hebbian plasticity over co-activation: edges learn from what gets recalled together. Opt-in |
| consolidation | light and deep sleep cycles; a deep sleep is all or nothing — a failure halfway leaves the memory as it was |
| time | bi-temporal: the date a thing happened and the date it was recorded are kept apart |
| entities | GLiNER zero-shot extraction over a rule-based baseline (Zaratiana et al., 2023) |
| surfaces | MCP, REST over HTTPS, command line, full-screen console, macOS menu bar and setup windows |
| extensions | a plug-in interface — shared libraries over a C ABI |
| delivery | dmg (Developer ID signed and notarised by Apple), deb, rpm (GPG-signed), tar.gz, Homebrew, Docker image. GPG-signed manifest over every artifact; container images signed with cosign |

Every mechanism above is named with the published work it comes from, where there
is one. Several are borrowed from memory science rather than from search
engineering — that is deliberate, and it is the part of the design worth arguing
about.

**[What this is built on](THEORY.md)** — the papers behind each mechanism, with
authors and links, and a plain statement of which parts are ours.

## Licence

[LICENSE](LICENSE) and [EULA](EULA.txt); translations in [legal/](legal/).

---

[Seventh Wall Lab](https://github.com/Seventhwalllab) · Chile ·
[seventhwalllab.com](https://seventhwalllab.com)
