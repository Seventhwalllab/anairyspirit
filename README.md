# Mehengram

**Long-term memory for AI agents. Runs on your machine.**

An agent connected to Mehengram remembers across sessions: what you tried and how it
turned out, what it suggested and whether that worked, what you keep coming back to.
The memory is a graph that grows — associations strengthen with use, unused ones fade,
and consolidation runs in the background the way sleep does.

One binary. The memory layer needs no external model and no network.

## What it does

**Remembers by connection, not by list.** Every memory is a node, and edges carry
meaning: closeness, contradiction, supersession, part of a whole. So "what did we decide
about X" is found through what it is connected to, not only through matching words.

**Grows with use.** What fires together strengthens; what nothing reaches fades away.
Consolidation runs in two modes — frequent and cheap, rare and heavy — the second inside
a snapshot boundary that can be rolled back.

**Tells apart when it happened and when it learned it.** Each memory carries both times,
so "last week" means the week of the event. Time phrases in a query are understood in
six languages.

**Knows people and things.** Entities are extracted automatically; different spellings
of one name surface as merge candidates instead of splitting one person into five.

**Explains its results.** Any query can return a breakdown: what was found at each step,
how long it took, and why the results landed in that order.

## Your data

**On your disk.** The graph is a single file, crash-safe through a write-ahead log.

**Encrypted if you want it.** Three modes: none; passphrase asked at every start and
held in memory only; passphrase on disk for unattended boot. Switching between them
re-keys in place and keeps the data.

**Recoverable by you alone.** Every install gets its own 24-word recovery phrase,
generated locally. It releases a locked graph and resets a forgotten passphrase.

**Stoppable.** A kill switch with four levels, up to a one-way hard stop that survives
restart.

**Portable.** An encrypted bundle moves the whole graph to another machine.

## Stack

| layer | built with |
|---|---|
| core | Rust, a single statically linked binary |
| storage | custom graph engine: mmap snapshot + write-ahead log |
| encryption | ChaCha20-Poly1305 at the file level, key derived from a passphrase |
| vectors | BGE-M3 via ONNX Runtime, hardware acceleration per platform |
| reranking | cross-encoder (bge-reranker-v2-m3) |
| entities | GLiNER over a regex baseline |
| surfaces | CLI, REST/HTTPS, MCP, TUI, macOS menu bar |
| extensions | plug-ins as shared libraries over a C ABI |
| delivery | dmg, deb, rpm, tar.gz, Docker image — signed and checksummed |

## Status

Pre-release. Documentation, artifacts and benchmarks land here as they are ready.

---

[Seventh Wall Lab](https://github.com/Seventhwalllab) · Chile ·
[seventhwalllab.com](https://seventhwalllab.com)
