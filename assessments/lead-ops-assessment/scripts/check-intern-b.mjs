import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const assessmentRoot = path.resolve(scriptDir, "..");
const patchPath = "review/intern-b-ui-polish.patch";
const prPath = "review/intern-b-ui-polish.md";
const expectedFindingsPath = "reviewer/EXPECTED_FINDINGS.md";

const patch = readRequiredFile(patchPath);
const prDescription = readRequiredFile(prPath);
const expectedFindings = readRequiredFile(expectedFindingsPath);

assertIncludes(
  patch,
  "diff --git a/assessments/lead-ops-assessment/src/app/pages/FailedJobsPage.tsx b/assessments/lead-ops-assessment/src/app/pages/FailedJobsPage.tsx",
  "Intern B patch must target the failed CRM jobs panel."
);
assertIncludes(
  patch,
  "+const recentFailureWindowMs = 45 * 60 * 1000;",
  "Intern B patch must add a recency window that can hide older failed jobs."
);
assertIncludes(
  patch,
  "+  const visibleJobs = retryJobs",
  "Intern B patch must narrow the rendered retry jobs."
);
assertIncludes(
  patch,
  "+            <span>{statusLabels[job.status] ?? job.status}</span>",
  "Intern B patch must include harmless-looking status label cleanup."
);
assertIncludes(
  patch,
  'expect(screen.getByText("Retrying")).toBeInTheDocument();',
  "Intern B patch must update the public UI fixture expectation."
);

assertCandidateDescriptionSafe(prDescription);

assertIncludes(
  expectedFindings,
  "Intern B: UI Polish For Failed CRM Jobs",
  "Reviewer notes must include an Intern B section."
);
assertIncludes(
  expectedFindings,
  "Older retry_scheduled failures remain unresolved but disappear",
  "Reviewer notes must identify the hidden older-failure regression."
);
assertIncludes(
  expectedFindings,
  "operator-visible escape hatch",
  "Reviewer notes must request an operator recovery path."
);

run("git", ["apply", "--check", patchPath], "Intern B patch does not apply cleanly.");
runRegressionProbe();

console.log("Intern B reviewer check passed.");

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
    [/hide/i, "hide"],
    [/older\s+failed/i, "older failed"],
    [/visibility\s+regression/i, "visibility regression"],
    [/dead.?letter/i, "dead letter"],
    [/dlq/i, "DLQ"]
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
    run("git", ["apply", patchPath], "Could not apply Intern B patch for regression probe.");
    applied = true;

    run(
      "npx",
      ["vitest", "run", "tests/public/ui.public.test.tsx"],
      "Intern B patch should keep public UI tests passing."
    );

    const probe = `
      import { JSDOM } from "jsdom";

      const dom = new JSDOM("<!doctype html><html><body></body></html>", {
        url: "http://localhost"
      });

      globalThis.window = dom.window;
      globalThis.document = dom.window.document;
      Object.defineProperty(globalThis, "navigator", {
        value: dom.window.navigator,
        configurable: true
      });
      globalThis.HTMLElement = dom.window.HTMLElement;
      globalThis.Node = dom.window.Node;

      const React = await import("react");
      const { render, screen, cleanup } = await import("@testing-library/react");
      const { FailedJobsPage } = await import("./src/app/pages/FailedJobsPage");

      const baseJob = {
        id: "job_intern_b_recent",
        leadId: "lead_recent_retry",
        operation: "upsert_lead",
        status: "retry_scheduled",
        attemptCount: 1,
        nextRunAt: "2026-05-16T02:00:00.000Z",
        lastResponseCode: 500,
        lastError: "Recent CRM outage",
        createdAt: "2026-05-16T01:55:00.000Z",
        updatedAt: "2026-05-16T02:00:00.000Z"
      };
      const olderJob = {
        ...baseJob,
        id: "job_intern_b_older",
        leadId: "lead_older_retry",
        nextRunAt: "2026-05-16T00:30:00.000Z",
        lastError: "Older CRM outage",
        createdAt: "2026-05-16T00:00:00.000Z",
        updatedAt: "2026-05-16T00:30:00.000Z"
      };

      render(React.createElement(FailedJobsPage, { jobs: [olderJob, baseJob] }));

      if (!screen.queryByText("lead_recent_retry")) {
        throw new Error("Recent retry job was not rendered.");
      }

      if (!screen.queryByText("Retrying")) {
        throw new Error("Human-readable status label was not rendered.");
      }

      if (screen.queryByText("lead_older_retry")) {
        throw new Error("Older unresolved retry job is still visible; Intern B regression not present.");
      }

      cleanup();
    `;

    run(
      process.execPath,
      ["--import", "tsx", "--input-type=module", "--eval", probe],
      "Intern B patch did not produce the expected ops visibility regression."
    );
  } finally {
    if (applied) {
      run("git", ["apply", "-R", patchPath], "Intern B patch applied but could not be reversed.");
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
