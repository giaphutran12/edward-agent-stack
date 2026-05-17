# Candidate Repo Duplication Runbook

Status: reviewer/admin
Candidate export: excluded

## Problem

Candidates must receive the same assessment while remaining isolated from each other. A shared repo, shared pull-request list, or unverified copy can leak other candidates' work or reviewer-only answer material.

## Standard

Create one fresh private GitHub repo per candidate from a verified candidate export. Push only the exported package contents. Never push `reviewer/`, hidden tests, answer keys, model solutions, export tooling, generated output, real env files, or another candidate's branch into a candidate repo.

## Reason

Per-candidate private repos keep the assessment fair and let each candidate open PRs without seeing another candidate's approach. Verified exports keep the reviewer source tree separate from the candidate-facing package.

## Procedure

Generate and verify a clean package from the reviewer source tree:

```bash
cd assessments/lead-ops-assessment
bash scripts/export-candidate-package.sh
bash scripts/verify-candidate-export.sh
EXPORT_DIR="$(sed -n '1p' tmp/candidate-exports/latest.txt)"
```

Confirm GitHub authentication before creating repos:

```bash
gh auth status
```

Create a private repo for one candidate:

```bash
ORG="your-github-org"
CANDIDATE_SLUG="candidate-first-last"
REPO="lead-ops-assessment-${CANDIDATE_SLUG}"

gh repo create "${ORG}/${REPO}" \
  --private \
  --description "Private Lead Ops Assessment repo for ${CANDIDATE_SLUG}" \
  --disable-wiki
```

Push only the verified export:

```bash
PUBLISH_DIR="$(mktemp -d /tmp/lead-ops-candidate-publish.XXXXXX)"
cp -R "${EXPORT_DIR}/." "${PUBLISH_DIR}/"
cd "${PUBLISH_DIR}"
git init
git add .
git commit -m "Add lead ops assessment candidate package"
git branch -M main
git remote add origin "git@github.com:${ORG}/${REPO}.git"
git push -u origin main
```

Invite the candidate to that repo only:

```bash
GITHUB_USERNAME="candidate-github-username"
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${ORG}/${REPO}/collaborators/${GITHUB_USERNAME}" \
  -f permission=push
```

Tell the candidate to work in their private repo and open their final PR there. Do not invite candidates to the reviewer source repo, a shared assessment repo, or another candidate's repo.

Create a numbered batch when the candidate names are not known yet:

```bash
ORG="your-github-org"
EXPORT_DIR="$(sed -n '1p' tmp/candidate-exports/latest.txt)"
PUBLISH_DIR="$(mktemp -d /tmp/lead-ops-candidate-publish.XXXXXX)"

cp -R "${EXPORT_DIR}/." "${PUBLISH_DIR}/"
cd "${PUBLISH_DIR}"
git init -b main
git add .
git commit -m "Add lead ops assessment candidate package"

for CANDIDATE_NUMBER in 01 02 03 04 05 06 07; do
  REPO="lead-ops-assessment-candidate-${CANDIDATE_NUMBER}"
  gh repo create "${ORG}/${REPO}" \
    --private \
    --description "Private Lead Ops Assessment repo for candidate ${CANDIDATE_NUMBER}" \
    --disable-wiki
  git remote add "candidate-${CANDIDATE_NUMBER}" "git@github.com:${ORG}/${REPO}.git"
  git push "candidate-${CANDIDATE_NUMBER}" main
done
```

## Reviewer Handling

Keep grading material in the reviewer source tree. If you need to run hidden verification against a candidate submission, copy or fetch the candidate's final branch into a local reviewer workspace and run reviewer-only tooling there. Do not commit hidden tests, answer keys, scoring rubrics, expected findings, model solutions, or reviewer notes into the candidate repo.

Before sending access, verify the candidate repo contains no reviewer-only paths:

```bash
gh repo clone "${ORG}/${REPO}" "/tmp/${REPO}-check"
find "/tmp/${REPO}-check" \( \
  -path '*/reviewer/*' \
  -o -name '*hidden*' \
  -o -name 'ANSWER_KEY.md' \
  -o -name 'SCORING_RUBRIC.md' \
  -o -name 'EXPECTED_FINDINGS.md' \
  -o -name 'model-solution.patch' \
\) -print
```

The `find` command should print nothing. If it prints any path, delete the candidate repo and rebuild it from a fresh verified export.

## Completion Record

For each candidate, record:

- candidate slug
- private repo URL
- export path used
- verification command output summary
- invite timestamp
- reviewer responsible

## Candidate Message Template

Send this after adding the candidate to exactly one private repo:

```text
You now have access to your private Lead Ops Assessment repo:

{PRIVATE_REPO_URL}

Safety notes:
- This repo does not require secrets, real customer data, vendor accounts, OAuth, global installs, curl/bash installers, or binary downloads.
- If you do not want to install Node.js locally, use GitHub Codespaces from the repo page. Codespaces will use the included devcontainer and run npm ci for you.
- If you run it locally, use Node.js 20.19+ and npm 10+.

Start:
1. Open the repo.
2. Read README.md, ASSESSMENT.md, and assignment/PROMPT.md.
3. Run npm ci.
4. Run npm run typecheck, npm run test:public, and npm run build.
5. Create your work on a branch in this repo.
6. Open your final pull request in this same private repo.

Do not share repo access or copy your work into another candidate's repo.
```
