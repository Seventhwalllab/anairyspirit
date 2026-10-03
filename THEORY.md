# What this is built on

An Airy Spirit is not a wrapper around a vector database. Most of what it does
comes from published work — some of it from information retrieval, a good deal of
it from the science of human memory, and those two literatures rarely appear in
the same product.

This page names the work. Where a mechanism has an author, the author is credited
and the paper is linked. Where it does not — because we wrote it ourselves, or
because it is textbook arithmetic — that is said plainly too.

Two things this page deliberately does not do. It does not describe how the parts
are composed: which stage feeds which, in what order, with what weights. And it
does not report benchmark numbers; those live with the measurement, not with the
marketing.

---

## Memory, not search

The distinguishing choice is that retrieval is modelled on how remembering works
rather than on how search engines work. Three mechanisms carry that.

### Activation that reflects use, not just recency

A memory you reach for often should stay reachable; one you have not touched in a
year should fade — but not vanish, and not fade at a rate that ignores how often
it was used before.

That is the ACT-R base-level learning equation, and it is forty years old.

> Anderson, J. R., & Schooler, L. J. (1991). **Reflections of the Environment in
> Memory.** *Psychological Science*, 2(6), 396–408.
>
> Anderson, J. R., Bothell, D., Byrne, M. D., Douglass, S., Lebiere, C., & Qin, Y.
> (2004). **An Integrated Theory of the Mind.** *Psychological Review*, 111(4),
> 1036–1060.

Implemented from the published equation. Nothing is copied from the ACT-R
reference implementation, which carries a copyleft licence.

Off unless you turn it on — on our benchmark it ranked worse (see the note at the
end).

### Associations that form from what gets recalled together

Edges are not only similarity. They also learn from co-activation: things
recalled in the same breath grow a connection, whether or not their text looks
alike. This is Hebb's rule, stated in 1949 and still the cleanest description of
the phenomenon.

> Hebb, D. O. (1949). **The Organization of Behavior: A Neuropsychological
> Theory.** Wiley.

Off unless you turn it on.

### Spreading activation

A memory is more interesting if its neighbours are already relevant. Activation
spreads along the graph, so context surfaces material that the query itself never
mentions.

> Collins, A. M., & Loftus, E. F. (1975). **A Spreading-Activation Theory of
> Semantic Processing.** *Psychological Review*, 82(6), 407–428.
>
> Anderson, J. R. (1983). **A Spreading Activation Theory of Memory.** *Journal of
> Verbal Learning and Verbal Behavior*, 22(3), 261–295.

In the default recipe — not for ranking, though it helps there too and we take
that as a bonus, but because it is what makes this a memory rather than an index:
recall that runs through connections, not through the words of the query. The
stored graph is the past; activation spreading through it is what the memory is
doing now.

### Consolidation, and why it is called sleep

Loose material settles into connected structure in the background: duplicates
merge, edges form, topics emerge. The analogy to sleep-dependent consolidation is
not decoration — it is where the design came from. The literature is large; these
two are the usual entry points.

> McClelland, J. L., McNaughton, B. L., & O'Reilly, R. C. (1995). **Why there are
> complementary learning systems in the hippocampus and neocortex.**
> *Psychological Review*, 102(3), 419–457.
>
> Diekelmann, S., & Born, J. (2010). **The memory function of sleep.** *Nature
> Reviews Neuroscience*, 11, 114–126.

---

## Retrieval

### Dense embeddings

> Chen, J., Xiao, S., Zhang, P., Luo, K., Lian, D., & Liu, Z. (2024).
> **M3-Embedding: Multi-Linguality, Multi-Functionality, Multi-Granularity Text
> Embeddings Through Self-Knowledge Distillation.**
> [arXiv:2402.03216](https://arxiv.org/abs/2402.03216) · BAAI · MIT licence.

Both the dense vectors and the lexical-weight head come from this model.

### Lexical scoring

Dense similarity smears rare proper names, acronyms and exact phrases. BM25 does
not, which is why both run.

> Robertson, S. E., Walker, S., Jones, S., Hancock-Beaulieu, M., & Gatford, M.
> (1994). **Okapi at TREC-3.** *Proceedings of TREC-3*.
>
> Robertson, S., & Zaragoza, H. (2009). **The Probabilistic Relevance Framework:
> BM25 and Beyond.** *Foundations and Trends in Information Retrieval*, 3(4),
> 333–389.

### Rank fusion

> Cormack, G. V., Clarke, C. L. A., & Büttcher, S. (2009). **Reciprocal Rank
> Fusion outperforms Condorcet and individual Rank Learning Methods.**
> *SIGIR '09*.

### Reranking

> Nogueira, R., & Cho, K. (2019). **Passage Re-ranking with BERT.**
> [arXiv:1901.04085](https://arxiv.org/abs/1901.04085)

The model in use is `bge-reranker-v2-m3` (BAAI, Apache-2.0).

### Community structure

> Blondel, V. D., Guillaume, J.-L., Lambiotte, R., & Lefebvre, E. (2008). **Fast
> unfolding of communities in large networks.** *Journal of Statistical Mechanics*,
> P10008.

Implemented from the paper. The widely used reference implementations are
copyleft; ours is not derived from them.

### Graph centrality

> Page, L., Brin, S., Motwani, R., & Winograd, T. (1999). **The PageRank Citation
> Ranking: Bringing Order to the Web.** Stanford InfoLab.

---

## Storage and indexing

### Approximate nearest neighbours

> Malkov, Yu. A., & Yashunin, D. A. (2016). **Efficient and robust approximate
> nearest neighbor search using Hierarchical Navigable Small World graphs.**
> [arXiv:1603.09320](https://arxiv.org/abs/1603.09320) · later in *IEEE TPAMI*.

Our own implementation, written from the paper.

### Vector compression

Eight times smaller with no codebook to train, ship or keep in step with the data.

> Gao, J., Gou, Y., Xu, Y., Yang, Y., Long, C., & Wong, R. C.-W. (2024).
> **Practical and Asymptotically Optimal Quantization of High-Dimensional Vectors
> in Euclidean Space for Approximate Nearest Neighbor Search.**
> [arXiv:2409.09913](https://arxiv.org/abs/2409.09913) · SIGMOD 2025.

Reimplemented from the paper. The authors publish under Apache-2.0, and Apache
Lucene adopted the same method — two independent reasons this was a comfortable
one to build on.

### Time

Two timestamps per memory: when the thing happened, and when the memory learned of
it. The distinction is standard in temporal databases and is what makes "last
Tuesday" answerable about the world rather than about our write log.

> Snodgrass, R. T. (Ed.) (1995). **The TSQL2 Temporal Query Language.** Kluwer.
> Standardised into SQL:2011.

---

## Entities

> Zaratiana, U., Tomeh, N., Holat, P., & Charnois, T. (2023). **GLiNER:
> Generalist Model for Named Entity Recognition using Bidirectional Transformer.**
> [arXiv:2311.08526](https://arxiv.org/abs/2311.08526) · Apache-2.0.

Zero-shot: entity types are given at query time, not baked into a trained
classifier. A regex layer runs underneath it and needs no model at all.

---

## Cryptography

Chosen partly for a property that has nothing to do with speed: these designs are
free of patent encumbrance by their authors' explicit intent, which is not true of
every primitive on offer.

> Nir, Y., & Langley, A. (2018). **ChaCha20 and Poly1305 for IETF Protocols.**
> [RFC 8439](https://www.rfc-editor.org/rfc/rfc8439).
>
> Biryukov, A., Dinu, D., Khovratovich, D., & Josefsson, S. (2021). **Argon2 Memory-
> Hard Function for Password Hashing and Proof-of-Work Applications.**
> [RFC 9106](https://www.rfc-editor.org/rfc/rfc9106). Winner of the Password
> Hashing Competition.
>
> Josefsson, S., & Liusvaara, I. (2017). **Edwards-Curve Digital Signature
> Algorithm (EdDSA).** [RFC 8032](https://www.rfc-editor.org/rfc/rfc8032).
>
> Krawczyk, H., & Eronen, P. (2010). **HMAC-based Extract-and-Expand Key Derivation
> Function (HKDF).** [RFC 5869](https://www.rfc-editor.org/rfc/rfc5869).

---

## What is ours

The storage engine — an mmap snapshot with a write-ahead log, crash-safe by
replay. The plug-in boundary over a C ABI. The stage pipeline itself: the idea
that retrieval is composed rather than fixed, and that the composition is a line
in a settings file. Peripheral memory as separate subgraphs. And the ranking
stages that have no paper behind them because they came out of measuring this
system rather than reading about someone else's.

Everything above is credited where credit exists. Where a line says "ours", it
means we could not find prior art for it and are not claiming there is none — only
that we did not take it from anywhere.

---

## A note on negative results

Some of what is listed here is available but not switched on by default, and the
reason is usually that we measured it and it did not help *on this workload*. That
is not a verdict on the technique. ACT-R base-level activation is the example: a
sound idea with a long record, and on our benchmark it ranked worse, so it waits
to be switched on. Graph traversal is the other case: used as a retriever on
its own, on a personal memory graph whose edges are mostly similarity-derived,
it re-did the dense retriever's work — which is not what it is for. It is in the
default recipe for association, not for ranking.

We would rather say that than quietly ship a stage that earns nothing.
