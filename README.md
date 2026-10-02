# <img src="assets/icon.png" width="56" height="56" align="middle" alt=""> An Airy Spirit "Coming Soon"

**Long-term memory for AI agents. Runs on your machine.**

An agent connected to An Airy Spirit remembers across sessions: what you tried and how it
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
| core | Rust, a single statically linked binary. No runtime, no interpreter, no service to call |
| storage | custom graph engine: mmap snapshot + write-ahead log, crash-safe by replay |
| encryption | ChaCha20-Poly1305 at the file level, key derived from a passphrase with Argon2id |
| vectors | BGE-M3 via ONNX Runtime, hardware acceleration per platform |
| vector storage | Extended RaBitQ — 8× compression, no codebook to train or ship (Gao et al., SIGMOD 2025) |
| nearest neighbours | HNSW, own implementation (Malkov & Yashunin, 2016) |
| retrieval | a pipeline of stages you compose in settings, not a fixed recipe: dense similarity, lexical scoring (Okapi BM25), rank fusion, graph traversal, community structure, cross-encoder reranking. The default recipe uses four of these; the rest are one settings line away |
| ranking by use | ACT-R base-level activation — what you reach for often stays reachable (Anderson & Schooler, 1991) |
| associations | Hebbian plasticity over co-activation: edges learn from what gets recalled together. Off unless you turn it on |
| consolidation | sleep cycles — light and deep. Loose material settles into connected structure in the background |
| time | bi-temporal: when a thing happened, separately from when the memory learned of it |
| entities | GLiNER zero-shot extraction over a regex baseline (Zaratiana et al., 2023) |
| surfaces | CLI, REST/HTTPS, MCP, TUI, macOS menu bar |
| extensions | plug-ins as shared libraries over a C ABI |
| delivery | dmg, deb, rpm, tar.gz, Docker image. GPG-signed manifest over every artifact; container images signed with cosign |

Every mechanism above is named with the published work it comes from, where there
is one. Several are borrowed from memory science rather than from search
engineering — that is deliberate, and it is the part of the design worth arguing
about.

**[What this is built on](THEORY.md)** — the papers behind each mechanism, with
authors and links, and a plain statement of which parts are ours.

## Status

Pre-release. Documentation, artifacts and benchmarks land here as they are ready.

---

[Seventh Wall Lab](https://github.com/Seventhwalllab) · Chile ·
[seventhwalllab.com](https://seventhwalllab.com)
