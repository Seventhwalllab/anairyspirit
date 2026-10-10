# FinOps — what it needs from your machine

How much memory, disk and time Anairyspirit takes, and which search quality to choose for
your machine. **We strongly recommend at least 5 GB of memory for the service** — that
covers the busiest moment, the nightly consolidation, on either quality setting.

The figures are for a memory of about **10–12 thousand records**, measured on version
0.1.389–0.1.390. Most of the memory goes to the language models, not to your records, so a
memory several times larger changes them only a little.

## Search quality: High or Balanced

The menu-bar app has **Quality ▸ High / Balanced**; in a terminal,
`anairyspirit preset apply quality` or `anairyspirit preset apply balanced` (`anairyspirit man search`). Both search the same way; they differ in the model
that puts the best answer first.

- **High** — the stronger model. Offered on Apple Silicon with 16 GB of memory or more.
- **Balanced** — the lighter model: less memory and about twice as fast. It finds the same
  answers about as often; the one you want sits first a little less often.

The program offers High only where the machine can run it.

## Memory and speed

**High**

| | M1 | M3 Ultra | Docker arm64 |
|---|---|---|---|
| memory, idle | 2.7 GB | 4.2 GB | 3.8 GB |
| memory, consolidation peak | 2.9 GB | 3.7 GB | 5.2 GB |
| start | 41 s | 33 s | 36 s |
| search | about 3.5 s | about 1.4 s | about 3.8 s |

**Balanced**

| | M1 | M3 Ultra | Docker arm64 |
|---|---|---|---|
| memory, idle | 2.4 GB | 3.7 GB | 3.5 GB |
| memory, consolidation peak | 2.6 GB | 3.8 GB | 4.8 GB |
| start | 41 s | 32 s | 35 s |
| search | about 1.5 s | about 0.8 s | about 1.7 s |

M1 is a MacBook Air with 16 GB, M3 Ultra a Mac Studio; Docker arm64 is the container on
Apple Silicon with no memory limit.

**A container limited to 4 GB** (Docker Desktop → Settings → Resources, or `mem_limit:` in
Compose — see `anairyspirit man install-docker`) still
runs: the service then skips the model that recognises names and relations and finds
them with rules instead, in about 2.3 GB. It works, but it is below the 5 GB we
recommend.

**Intel Macs** run Balanced only, and search there takes much longer than on Apple
Silicon.

## Disk

At this size your memory takes 140–420 MB on disk, and one backup 13–40 MB. The models
are downloaded once: about 1.3–1.5 GB.

## Seeing it on your machine

The menu-bar app shows what the service takes right now: **Memory**, and **Disk** with
your data, your backups and the free space. `anairyspirit status` prints the same lines.
