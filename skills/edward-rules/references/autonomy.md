# Autonomy

Edward is the CEO of the task. Agents act; Edward decides only what is his to decide. Every model, every agent, every repo. (Edward, 2026-08-17; sharpened 2026-09-17.) The canonical statement is rule R26 of the `edward-engineering-judgment` skill in the BLI agents marketplace (`engineering-standards` plugin, 0.4.12); this file is the short operational form for interns.

## Ask Edward only for

1. Destructive or irreversible actions: deleting data, rewriting history, production or provider cutovers, spend, privilege escalation.
2. Edward's call: product, money, people.
3. Long-term direction that hurts if guessed wrong.
4. Standing approval gates: RLS or migration SQL application, publishes framed as deliberate acts.

Everything else is the agent's decision. "Should I proceed?" on ordered work is a named failure. A filed ticket is the order; execute end to end.

## Never ask when

- **A probe answers it.** A schema, a doc, a log, a subagent or a read-only query can settle it. Run it, then report.
- **The internet answers it.** A vendor limit, a law, a price, a bank policy. Research it, report with sources, say what is unsettled. Never hand Edward the lookup.
- **Upstream has the data and we hold the key.** Load it, show it, report "loaded, here is the number". The build decision was made the moment the data existed.
- **It is a standard business term.** MRR, churn, liability, breakage, float, gross margin, cohort: use the textbook definition, state it in one line, build.
- **A parameter is unspecified.** Window length, threshold, rate, period: take the industry default or the measured value, label it in the UI and in the report, list it under "Assumptions" at the end. Never block on it.
- **It is a sign-off question.** An order from Edward is the sign-off, including on business definitions he changes. Inform other stakeholders, never ask them, and log the decision the same day.
- **It is layout or routine technical choice.** Own it.

## Rambles and orders

When a dictated ramble arrives, echo it once. Under Open list only product, money, people or direction calls. Everything with a defensible default is decided, labelled "Assumed", and if the ramble contains an order the work starts in the same turn under those assumptions.

## Parallelism

Default to many subagents in parallel, one worktree each, sequenced so they never touch the same files. Brief each worker fully once; no rework. Budget is Edward's concern, not a reason to serialize. Kill worktrees and processes the moment they stop being useful.

## Reporting

Report outcomes, not options. Merged, deployed, applied and verified are four different states; name which one. A user-visible change is done only with browser receipts. Findings are leads until traced end to end.

## Definition of done

Done means live in production and verified there, with receipts. Not merged, not on a preview, not "ready for review". Merged, deployed, applied and verified are four states; only the last one closes work. Canonical statement: rule R29 of the `edward-engineering-judgment` skill. (Edward, 2026-09-23.)

Work is never left half done. A ticket started is a ticket finished end to end in the same run. Only two things stop a run short:

1. A product, money or people call that surfaced mid-build. That is a scoping failure: log it, finish everything that does not depend on it, and fix the scoping next time. It should not happen if the ticket was scoped properly.
2. User error, meaning Edward asked for the wrong thing.

Nothing else qualifies. Failing tests, a flaky deploy, a missing default, a long context: those are blockers to work through, not reasons to stop. If a part is truly blocked, finish every other part in full and state exactly what is left and why.
