# Lead Ops Take-Home Assessment Decisions

Updated: 2026-05-16
Status: Approved for Autorunner ticket flow

## Decisions

| Area | Decision | Reason |
| --- | --- | --- |
| Assessment shape | One synthetic messy lead-ops repo | Real production code is too sensitive; a controlled repo is easier to grade and repeat. |
| Complexity model | Two external-style boundaries plus one async boundary | Tests cross-boundary system judgment without turning the take-home into vendor trivia. |
| App architecture | Single repo, single app, two runtime entrypoints: web/API plus worker | Keeps setup manageable while still exposing real lifecycle complexity. |
| Stack target | TypeScript app with deterministic fake adapters and tests | Matches the AI-native full-stack role while keeping setup portable. |
| Candidate isolation | One private candidate copy per candidate | Same question for everyone, no cross-candidate PR visibility. |
| Answer key | Reviewer-only directory plus hidden tests and model solution patch | Lets Edward grade fast without leaking expected findings. |
| Public tests | Public baseline tests must pass on the candidate repo | Candidate repo should feel runnable, not broken from install. |
| Hidden tests | Hidden tests should fail on baseline and pass on answer key | Proves intended bugs exist and the answer key actually fixes them. |
| Intern PR track | Two small fake intern patches | Tests review judgment without making the reading load too wide. |

## Rejected

- Real external API accounts: rejected because secrets, OAuth, and vendor setup would dominate the signal.
- Multi-service deployment: rejected because it creates endurance/setup tax instead of better judgment signal.
- One shared GitHub repo for all candidates: rejected because candidates could see each other's PRs.
- LLM features: rejected because the role uses AI, but this assessment should test engineering judgment around code and systems first.
