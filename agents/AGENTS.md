<skills>

You have additional SKILLs documented in directories containing a `SKILL.md` file.

Use this file only as a fallback when the agent host cannot auto-discover skills.
If skills are installed normally, prefer the native skill loader.

These skills are:

- edward-rules -> `skills/edward-rules/SKILL.md`
- edward-decision-capture -> `skills/edward-decision-capture/SKILL.md`
- edward-escalation -> `skills/edward-escalation/SKILL.md`
- edward-intern-coach -> `skills/edward-intern-coach/SKILL.md`
- edward-project-notes -> `skills/edward-project-notes/SKILL.md`

IMPORTANT: You MUST read the matching `SKILL.md` whenever the skill description
matches the user intent or may help accomplish the task.

<available_skills>

edward-rules: `Use at the start of Edward/intern coding tasks to load Edward's stable engineering rules, route questions, and decide which Edward child skill or reference to load next.`

edward-decision-capture: `Use before opening a PR or ending a meaningful task to update Project Notes and Decision Notes from the conversation and diff.`

edward-escalation: `Use when Codex/intern still needs Edward after asking Codex, researching docs/internet, and understanding options.`

edward-intern-coach: `Use when coaching Edward's interns on what to do next, how to use Codex first, Edward's default stack choices, when to ask Edward, PR/review readiness, database safety, and Edward-style engineering judgment.`

edward-project-notes: `Use when creating or updating project PROJECT.md files and dated decision notes for Edward's intern workflow.`

</available_skills>

Paths referenced inside skill folders are relative to that skill folder.

</skills>
