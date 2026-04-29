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
