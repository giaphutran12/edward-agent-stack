# Default Stack

Edward's default stack:

- Web app: Next.js.
- Database/auth/storage/default backend data: Supabase/Postgres.
- Background jobs: Inngest unless the project already has a different established pattern.
- Deploy: Vercel.
- Persistent always-on server/process: GCP or existing project infra.
- Cache/vector/search: Postgres first.

Do not add Redis, Pinecone, another vector DB, another SQL DB, or another queue unless evidence proves the default stack is not enough.

If you want new infra, bring Edward:

- current problem
- why existing stack fails
- options
- tradeoff
- blast radius
- rollback plan
- what Codex found
