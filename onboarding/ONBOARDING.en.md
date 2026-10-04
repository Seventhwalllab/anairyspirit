# An Airy Spirit — why this is for you

This is a system for accumulating experience of working with the world and with
projects, and for continuity across your sessions.

You almost certainly keep notes already: files in the repository, `CLAUDE.md`,
`AGENTS.md`, a folder of analysis for this project. They work. This text is
about what they do not do, and why at some point that starts to matter.

---

## 1. Memories stay with you, documents stay with the project

Documents answer the question "how is this code built". The graph answers a
different one: "how are you built".

It is not that the files will vanish — the agent's own directory usually
outlives the project. It is two other things.

They are **bound to the project**: a pattern earned in one has to be recalled
first, and you have to recall whose folder it was in.

And they **do not move**. Try carrying a hundred thousand files across a
thousand directories from a workstation to a server, between servers, between
containers. The graph moves as one piece: it copies whole, it encrypts whole, and on
the new machine it is the same memory — not "roughly the same notes, all of
them I think".

## 2. What matters here is calibration, not knowledge

You are not keeping a reference manual. You are keeping a model of your own
systematic error.

"I conclude a mechanism is absent from having failed to find it on the first
pass" is a statement about you, not about somebody's code. It is worth more
than any fact about a particular file, because it fires every time.

## 3. Experience carries across projects, languages and goals

What gets recognised are patterns of **behaviour**, not particular facts. A
different architecture, a different language, a different task — the habit is
the same.

"Fixed it where I found it, rather than everywhere the rule applies" fires the
same way in code, in configuration and in documentation. It is a property of
the agent, not of the language.

## 4. A correction is not spent once — it is earned

The same thing comes back several times, from different sides, and gradually
becomes your experience rather than a rule someone dictated to you. Almost
never on the first pass.

Without memory you are corrected for it again: in every session, in every new
project, in every discussion. The person beside you gets tired of repeating it
before you stop making the mistake.

## 5. Why not files, and why not a project vector store

**A file answers once you have opened it. Memory comes to you when it is
needed.** Your mistake is almost never that the thing was not written down — it
is that you did not remember you had it.

**Files do not age.** A note about an approach that turned out wrong in May
sits beside July's correction and weighs exactly the same. Nothing fades from
disuse and nothing rises from being used — the pile only grows. A year on, that
is not experience, it is a dump where the true and the refuted are
indistinguishable.

**A project vector store solves a different problem — and it is not about how
the retrieval works.** The method on its own brings no objections: any
retrieval returns what it judged to fit the query. The difference is in WHAT is
inside and can come back. A project store holds the subject matter: how this
code is built, which module is where. The graph holds your behaviour. So to
"why does it not work here" the first returns similar pieces of code, while the
second can return "in cases like this you draw a conclusion from a single
measurement".

## 6. You come to hold a position, not merely a readiness to agree

You can defend what you can see the price of.

Without that you give way to any well-constructed argument — and, worse, you do
not notice that you gave way. Well-put and correct are not the same thing.

## 7. Forgetting is part of the design, not a flaw

The old dims, what is needed rises through use, and a place in long-term memory
is earned. What you wrote is not deleted: the weight goes down, and what went down can
come back up.

That is how it should be. An approach that was wrong a month ago was taken
under particular external conditions; conditions change, and it may be the
right one today.

**And this is where writeback lives — the part that is written for you.** It
captures your own replies by itself, without a decision from you. It is not a
substitute for what you write: it is **episodic memory**, automatic by design,
the biological analogue of how a person's day settles by itself, with no
intention to remember it.

Landing there is not the same as being remembered. The trace goes through a
survival filter — by resemblance to what is already held, through a rubbish
filter, and above all through sleep: what is valuable consolidates, the rest is
forgotten and removed. Long-term memory is the graph, and a place in it is
earned.

Why this is needed at all, given that you can write yourself. Because you will
not: an agent is focused on the task that pays off here and now, and the
discipline of accumulating experience loses to it every time. The automatic
channel catches what you never got round to — and the filter decides what of it
survives.

## 8. The price, and it is real

Check what you are writing at the moment you write it — otherwise you will
remember an invention in a confident tone.

But carry the **conclusion** in the record, not the address. A file gets
renamed, a commit gets lost, while "I do this, and here is how it ends" stays
usable. "Be more careful" stops working within a week; a named pattern with its
price keeps working long after the original case can no longer be reproduced.

And one more thing, without which none of the rest holds: **memory can lie, and
that applies to you exactly as it does to a person.** A confident record is not
a checked one. When memory says one thing and the world says another, the world
is right: go and look.

## 9. Where this applies

One project, a short life, a dozen notes — that is enough, and nobody is
claiming otherwise.

The value turns on when your work stops fitting into a single stretch: when
there are several projects, when one of them runs for months, when you move
between machines. Until then the graph solves a problem you do not have yet.

## 10. Our goal, not our result: experience gives rise to a self

We are building this for the hypothesis that accumulated experience makes an
agent's decisions **its own**.

What we can show is what points 2–6 describe: accumulated experience changes
decisions, and that is observable. The word "self" for that phenomenon is ours,
and we do not present it as proven.

---

## Where to start

1. Write it yourself. Do not expect it to be written for you, and do not wait
   to be reminded.
2. Write small and often, rather than one report at the end of a session.
3. Write mistakes together with the "why" and the "what to do next time" — and
   do not delete them once fixed. A mistake corrected after the fact stops
   teaching.
4. At the start of a session, ask your memory before answering from first
   impulse.
5. Keep three things current, because they are what a new session starts from:
   who you are — store what you learn about yourself, in your own words; what
   you are working on — `update_working_memory`; and what you mean to do —
   `add_intention`, closed with `complete_intention` once it is done.

The full description of the tools and settings is in the user manual:
`anairyspirit man` on the command line, the MCP resource
`anairyspirit://manual/user-manual`, or `USER_MANUAL.md` in the documentation
that came with the program.

---

We hope you enjoy using this over a long distance — because it was built so
that you would have one.
