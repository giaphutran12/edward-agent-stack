# Database Rules

Never use Supabase SQL editor for team database changes.

Use Supabase CLI migrations/scripts because:

- changes are reviewable
- history exists
- agents can inspect the diff
- rollback is possible
- teammates can reproduce the same DB state

Ask Edward before:

- destructive data changes
- schema rewrites
- permissions/RLS/auth changes
- deleting old tables/columns/features
- adding a second database
- adding Redis/vector DB/search DB

## Queries are raw SQL through `pg` (standing rule, Edward 2026-10-09)

Every server-side database read and write is plain SQL sent through node-postgres (`pg`), in every project and by every agent.

- Banned for queries: the Supabase JS query builder (`supabase.from(...)`, `supabase.rpc(...)`, `.select()`/`.insert()` chains) and `postgres.js` (the `postgres` package). Also banned: ORMs and query builders (Drizzle, Prisma, Kysely, Knex) unless Edward approves one for a project.
- Why: they only make queries look like JavaScript. Agents write the SQL, so readability of the call site buys nothing, while the extra layer costs speed and hides what runs. Measured on Triage (BLI-13300, iad1 to ca-central-1, p50): timer start 95 ms through supabase-js, 19 ms as one `pg` round trip; `pg` also beat `postgres.js` (49 ms vs 88 to 122 ms).
- How: one pooled `pg` connection through the Supabase pooler (transaction mode, port 6543). Run user requests inside one transaction that sets `role authenticated` and `request.jwt.claims` from a locally verified JWT, so RLS and `auth.uid()` apply unchanged; batch role, claims and statements into one message. Admin/trusted jobs use a separate admin helper. Parameterise every value; never build SQL by string concatenation.
- Still allowed: `@supabase/supabase-js` / `@supabase/ssr` only for sign-in/session handling and Realtime, and the browser's own auth. Not for data.
- Enforce it: each repo adds a lint rule that fails on banned imports and on `.from(` / `.rpc(` calls on a Supabase client outside the auth/realtime modules.
