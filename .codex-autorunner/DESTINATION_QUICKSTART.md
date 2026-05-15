<!-- CAR:DESTINATION_QUICKSTART -->
# Destination Quickstart

## Goal
- Configure where a repo/worktree executes (`local` or `docker`).
- Bring your own docker image with `--image <registry/image:tag>`.

## Core commands
- Show effective destination:
  `car hub destination show <repo_id> --path <hub_root>`
- Set local destination:
  `car hub destination set <repo_id> local --path <hub_root>`
- Set docker destination with a custom image:
  `car hub destination set <repo_id> docker --image <registry/image:tag> --path <hub_root>`
- Discover advanced flags (profile/workdir/env/mounts):
  `car hub destination set --help`

## Docs for progressive discovery
- Runtime guide: `docs/configuration/destinations.md`
- Manifest contract: `docs/reference/hub-manifest-schema.md`

## Notes
- `profile` is optional; currently only `full-dev` is supported.
- If `profile` is omitted, docker still runs your image using only explicitly configured env/mount settings.
