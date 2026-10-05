# Engineering call-outs

Mistakes Edward had to call out, written so no agent repeats them. Every model, every agent, every repo. Read with `autonomy.md`, which already holds the call-outs about asking, bugs and rate limits (linked at the end).

## Rules

1. **Verify uploads by fingerprint, never by downloading them back.** Hash the bytes locally, compare with the checksum the store reports for the object. Re-download only when no server-side checksum exists, and say so.
   Why: 2026-10-05, Kaiben uploads re-downloaded every object to check it. That doubled Supabase egress (~260 GB since 10-03 against a 250 GB allowance), made each car-shard clearing pass take 30+ min, and was 216 of ~460 ms per render upload. "We should have used the fingerprint from the start."

2. **A surprising number is a measurement bug until traced.** Measure rates over active time only (first to last real event), never over idle, archive or empty-queue minutes. Go to the bottom of it before reporting a conclusion.
   Why: 2026-10-05, Rim Pros "got slower" at 20 req/s (14,505/h vs 21,834/h at 10). Per minute it was the same ~390/min; the queue had emptied and the window counted the dead minutes. Edward: "That's stupid, right? You got to find out and go to the bottom of it."

3. **Use everything the plan pays for.** After any resize or setup, compare actual disk, CPU and RAM with the plan's spec (`size.disk` vs `disk` in the DigitalOcean API) and max out what is paid for.
   Why: 2026-10-05, main ran on 80 GB while its s-4vcpu-8gb plan includes 160 GB (a CPU/RAM-only resize kept the old disk). Its 20 GiB download floor and a 256 MB cache followed from that. Fixed in a 3-minute resize. "Who came up with 80? Double that up."

4. **Check recorded decisions before any structural choice.** Repo layout, architecture, where code lives: search BLI Memory and project memory first, follow what Edward already decided.
   Why: 2026-10-05, an agent created a new local repo for the Kaiben scripts although Edward decided on 2026-09-30 that everything lives in the one monorepo, BLI-INC/Black-Knight-Marketplace. "Why the hell are you creating a repository?"

5. **Code never lives on one machine.** Commit and push working scripts to a remote feature branch continuously, from the first working version. For scratch or data scripts, push to the feature branch without PR or merge churn unless asked.
   Why: 2026-10-05, the Kaiben collectors (2-3 days of hard-won fixes, ~37,000 lines) existed only on Edward's laptop. "Code is two-wayable, but good code is not."

6. **The business priority decides every allocation.** State it at the top of every plan, and give machines, keys, CPU and agent time to the top priority first. For Kaiben: wheels and tires (fitment, hardware, sensors) first, car pictures last.
   Why: 2026-10-05, Edward had to repeat "wheels and tires are top one" several times while car renders were holding store keys and CPU.

7. **Don't serialize independent work.** Never wait for an unrelated job to finish before starting a test or a fix; run it now and control interference instead.
   Why: 2026-10-05, the render rate test was held "until Rim Pros finishes". Edward: "Why do we need until the rim browse finishes? Let me test it right now."

8. **No silent hours.** Every long-running job gets a check every 15 min or faster: progress moved, last run succeeded, nothing stuck in one phase. A job that has failed quietly for hours is the operator's defect.
   Why: 2026-10-05, the SigLIP 2 labelling job failed silently for ~12 h (HTTP 544 on bucket listing), and four shards downloaded nothing for 5.5 h in a cache loop nobody saw. "Check every 15 minutes to make sure things are moving."

9. **Error-only jobs stop themselves; idle paid machines go away.** A job with zero successes and a run of errors in 30 min is stopped by rule (retries plus if/else, no agent needed). A droplet with nothing to do is handed back safely and deleted, or given work.
   Why: 2026-10-05, "If it's broken anyway and there's no new value coming in, why keep it on?"

## Lessons Edward didn't call out (approved as rules)

Mistakes agents made on 2026-10-05 that Edward didn't catch, plus practices worth adopting. Edward approved every one as a rule on 2026-10-05; same weight as the rules above.

1. **Report the current rate, not the since-start average, and never score an empty window.** A window with no real activity is inconclusive: re-measure it, never call it clean.
   Why: the render downloader showed "92/min" since start while it ran at 15/min for 1.5 h behind one broken vehicle; a Lux limit-test window with 0 attempts was scored "clean" and raised the rate to 14.

2. **Deduplicate at the finest key, not a coarse one.** Compare items by part number or model id, never by brand or category.
   Why: the multi-store pull skipped any brand Kaiben already carried and took each brand from one store, so it missed 7,547 wheel models, 5,768 tire models and 225 whole brands.

3. **Never restart a worker mid critical phase.** Gate every restart on the phase's lock or process (archive pass, flush, merge).
   Why: the limit search restarted Lux at 05:20 and 05:31 in the middle of archive passes, so they never finished and Lux downloaded nothing for 20+ min.

4. **Raise concurrency only with memory bounded.** Cap in-flight work near what the slowest stage can drain (about 3x cores when 4 conversion slots are the bottleneck).
   Why: per-site concurrency went to 8-16 while downloads queued behind 4 conversion slots; Asia hit 7.3 GB RAM plus 3.3 GB swap and stalled, Lux the same at 181 MB free.

5. **Backups get a retention policy on day one, and never re-copy a whole database per batch.**
   Why: every clearing pass uploaded two full 5 GB snapshots of state.sqlite and none was ever deleted: 196.7 GB of a 304 GB bucket.

6. **Prove zero unique local data before deleting any machine.** Count local files missing from the remote archive and require 0, with a receipt.
   Why: the original hand-back would have deleted helper droplets still holding 31,790 un-uploaded pictures (GM 13,062, Honda 9,421, VW 9,307).

7. **Check live config against one registry, every cycle.** Units, flags and drop-ins drift; documentation is not evidence.
   Why: the shards and main ran `--cache-mib 256` while every doc said 2048; four shards then downloaded nothing for 5.5 h in a silent loop.

8. **After splitting work across machines, route new work continuously.** A one-time split strands everything discovered later.
   Why: 66,228 Porsche and 69,741 VW rows were imported on main after the split and nobody downloaded them.

9. **Errors mean "we must fix it"; everything else is a warning.** An ERROR is ours to act on: our bug, a wrong setting, capacity (memory, disk, CPU). It alerts the operator. A WARNING is the world changing with nothing to fix: the picture no longer exists, a link is dead, a site blocks us. It is counted and logged, never an alert. A hiccup (timeout, 5xx, 429 "slow down") is neither: retry it automatically with back-off, and only after the retries are exhausted record it as a warning with the reason. Never mark a hiccup as dead for good, and every early stop logs its reason.
   Why: 1,696 pictures were marked failed forever on hiccups (Honda's 191 HTTP 502s during a 43-minute outage), a 64 MiB per-request reservation silently ended Stellantis batches at ~200 files, and dead links were logged as errors next to real bugs, so the real ones drowned. Edward's framing, 2026-10-05: "real errors vs not real; not real is a warning: this picture ID no longer exists".

10. **Page large listings by cursor, never by offset.**
    Why: the SigLIP 2 labelling job paged 250k+ bucket objects by offset; late pages timed out (HTTP 544) and labelling was dead for ~12 h.

11. **Test a hardware hypothesis before buying.** Run one bigger machine against a smaller one on the same job and buy only if throughput scales with no source pushback.
    Why: the 8-core question was settled by one $4/day droplet in the spare slot instead of swapping the fleet on a guess.

## Already in autonomy.md (call-outs from the same day)

- **It is a bug**: fix it in the same turn, never report it as an offer.
- **It is a rate or capacity limit**: never guess; bisect deterministically with the one shared tested engine; every machine at ~95% CPU by stacking work.
- **Never ask when** a probe, a default or Edward's standing order answers it ("Don't even ask next time").
