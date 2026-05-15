import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const assessmentRoot = path.resolve(scriptDir, "..");
const patchPath = "review/intern-a-performance-cleanup.patch";
const prPath = "review/intern-a-performance-cleanup.md";
const expectedFindingsPath = "reviewer/EXPECTED_FINDINGS.md";

const patch = readRequiredFile(patchPath);
const prDescription = readRequiredFile(prPath);
const expectedFindings = readRequiredFile(expectedFindingsPath);

assertIncludes(
  patch,
  "diff --git a/assessments/lead-ops-assessment/src/repository/repository.ts b/assessments/lead-ops-assessment/src/repository/repository.ts",
  "Intern A patch must target the repository write-and-queue boundary."
);
assertIncludes(
  patch,
  "-    const before = this.snapshot();",
  "Intern A patch must remove the pre-write snapshot."
);
assertIncludes(
  patch,
  "-      this.restore(before);",
  "Intern A patch must remove rollback on write/enqueue failure."
);
assertIncludes(
  patch,
  "+    const lead = this.upsertLead(input.lead);",
  "Intern A patch must bypass the existing guarded write path."
);

assertCandidateDescriptionSafe(prDescription);

assertIncludes(
  expectedFindings,
  "LeadOpsRepository.writeLeadAndEnqueueCrmSync",
  "Reviewer notes must name the affected write-and-queue method."
);
assertIncludes(
  expectedFindings,
  "partial write",
  "Reviewer notes must identify the partial-write regression."
);
assertIncludes(
  expectedFindings,
  "no matching CRM sync job exists",
  "Reviewer notes must identify the missing-sync-job impact."
);

run("git", ["apply", "--check", patchPath], "Intern A patch does not apply cleanly.");
runRegressionProbe();

console.log("Intern A reviewer check passed.");

function readRequiredFile(relativePath) {
  const absolutePath = path.join(assessmentRoot, relativePath);
  if (!existsSync(absolutePath)) {
    fail(`Missing required file: ${relativePath}`);
  }
  return readFileSync(absolutePath, "utf8");
}

function assertIncludes(value, expected, message) {
  if (!value.includes(expected)) {
    fail(message);
  }
}

function assertCandidateDescriptionSafe(value) {
  const forbidden = [
    [/atomic/i, "atomic"],
    [/partial\s+write/i, "partial write"],
    [/roll\s?back/i, "rollback"],
    [/missing\s+(crm\s+)?sync\s+job/i, "missing sync job"]
  ];

  for (const [pattern, label] of forbidden) {
    if (pattern.test(value)) {
      fail(`Candidate-facing PR description leaks expected finding: ${label}`);
    }
  }
}

function runRegressionProbe() {
  let applied = false;
  try {
    run("git", ["apply", patchPath], "Could not apply Intern A patch for regression probe.");
    applied = true;

    const probe = `
      import { LeadOpsRepository } from "./src/repository/repository";
      import { FIXED_NOW } from "./src/repository/fixtures";

      const repository = new LeadOpsRepository();
      const before = repository.snapshot();
      const existingLead = before.leads[0];
      const lead = { ...existingLead, name: "Intern A Regression", updatedAt: FIXED_NOW };
      const inboundEvent = {
        ...before.inboundEvents[0],
        id: "inbound_evt_intern_a_regression",
        providerEventId: "evt_intern_a_regression",
        normalizedLeadId: lead.id
      };
      const duplicateJob = before.crmSyncJobs[0];
      let threwDuplicateJobError = false;

      try {
        repository.writeLeadAndEnqueueCrmSync({ lead, inboundEvent, crmSyncJob: duplicateJob });
      } catch (error) {
        threwDuplicateJobError = /already exists/.test(String(error));
      }

      if (!threwDuplicateJobError) {
        throw new Error("Regression probe did not trigger duplicate CRM job failure.");
      }

      const after = repository.snapshot();
      if (JSON.stringify(after) === JSON.stringify(before)) {
        throw new Error("Repository still rolled back; Intern A regression not present.");
      }

      if (!after.leads.some((item) => item.id === lead.id && item.name === "Intern A Regression")) {
        throw new Error("Partial lead write was not observed.");
      }

      if (!after.inboundEvents.some((item) => item.id === inboundEvent.id)) {
        throw new Error("Partial inbound event write was not observed.");
      }
    `;

    run(
      process.execPath,
      ["--import", "tsx", "--input-type=module", "--eval", probe],
      "Intern A patch did not produce the expected partial-write regression."
    );
  } finally {
    if (applied) {
      run("git", ["apply", "-R", patchPath], "Intern A patch applied but could not be reversed.");
    }
  }
}

function run(command, args, errorMessage) {
  const result = spawnSync(command, args, {
    cwd: assessmentRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      FORCE_COLOR: "0"
    }
  });

  if (result.status !== 0) {
    if (result.stdout) {
      console.log(result.stdout.trim());
    }
    if (result.stderr) {
      console.error(result.stderr.trim());
    }
    fail(errorMessage);
  }
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
