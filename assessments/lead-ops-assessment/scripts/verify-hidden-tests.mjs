import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const assessmentRoot = path.resolve(scriptDir, "..");
const expectBaselineFailures = process.argv.includes("--expect-baseline-failures");

const expectedBaselineFailures = [
  "webhook idempotency hidden tests deduplicates repeated provider deliveries by provider event id",
  "lead merge hidden tests preserves trusted contact fields when a partial provider update sends nulls",
  "CRM worker hidden tests moves terminal CRM validation failures to the DLQ without retrying",
  "CRM worker hidden tests treats Retry-After header values as seconds when scheduling rate-limit retries",
  "ops UI hidden tests surfaces dead-lettered CRM sync jobs for operator recovery"
];

if (process.argv.includes("--help")) {
  console.log(`Usage:
  node scripts/verify-hidden-tests.mjs
  node scripts/verify-hidden-tests.mjs --expect-baseline-failures`);
  process.exit(0);
}

const tempDir = mkdtempSync(path.join(tmpdir(), "lead-ops-hidden-tests-"));
const outputFile = path.join(tempDir, "results.json");
const vitestCli = resolveVitestCli();

const result = spawnSync(process.execPath, [
  vitestCli,
  "run",
  "reviewer/hidden-tests",
  "--reporter=json",
  "--outputFile",
  outputFile
], {
  cwd: assessmentRoot,
  encoding: "utf8",
  env: {
    ...process.env,
    FORCE_COLOR: "0"
  }
});

const testRun = readJsonReport(outputFile);
rmSync(tempDir, { recursive: true, force: true });

if (!testRun) {
  printCapturedOutput(result);
  console.error("Hidden verifier failed: Vitest JSON report was not produced.");
  process.exit(1);
}

const assertions = collectAssertions(testRun);
const failedAssertions = assertions.filter((assertion) => assertion.status === "failed");
const passedAssertions = assertions.filter((assertion) => assertion.status === "passed");
const failedNames = failedAssertions.map((assertion) => assertion.fullName);
const expectedFailureSet = new Set(expectedBaselineFailures);
const missingExpectedFailures = expectedBaselineFailures.filter((name) => !failedNames.includes(name));
const unexpectedFailures = failedNames.filter((name) => !expectedFailureSet.has(name));
const totalTests = testRun.numTotalTests ?? assertions.length;

if (expectBaselineFailures) {
  if (
    result.status !== 0 &&
    missingExpectedFailures.length === 0 &&
    unexpectedFailures.length === 0 &&
    failedAssertions.length === expectedBaselineFailures.length
  ) {
    console.log(`Hidden baseline verification passed.`);
    console.log(`Expected hidden failures: ${failedAssertions.length}`);
    console.log(`Hidden tests observed: ${totalTests}`);
    process.exit(0);
  }

  console.error("Hidden baseline verification failed.");
  console.error(`Expected hidden failures: ${expectedBaselineFailures.length}`);
  console.error(`Observed hidden failures: ${failedAssertions.length}`);
  if (missingExpectedFailures.length > 0) {
    console.error("Missing expected failures:");
    for (const name of missingExpectedFailures) {
      console.error(`- ${name}`);
    }
  }
  if (unexpectedFailures.length > 0) {
    console.error("Unexpected failures:");
    for (const name of unexpectedFailures) {
      console.error(`- ${name}`);
    }
  }
  if (result.status === 0) {
    console.error("Vitest exited successfully, but baseline mode requires expected hidden failures.");
  }
  process.exit(1);
}

if (result.status === 0 && failedAssertions.length === 0) {
  console.log(`Hidden verification passed: ${passedAssertions.length}/${totalTests} tests passed.`);
  process.exit(0);
}

printCapturedOutput(result);
console.error(`Hidden verification failed: ${failedAssertions.length}/${totalTests} hidden tests failed.`);
process.exit(result.status === null ? 1 : result.status || 1);

function resolveVitestCli() {
  const moduleCli = path.join(assessmentRoot, "node_modules", "vitest", "vitest.mjs");
  if (existsSync(moduleCli)) {
    return moduleCli;
  }

  const binCli = path.join(assessmentRoot, "node_modules", ".bin", "vitest");
  if (existsSync(binCli)) {
    return binCli;
  }

  throw new Error("Vitest is not installed. Run npm install before verifier commands.");
}

function readJsonReport(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  return JSON.parse(readFileSync(filePath, "utf8"));
}

function collectAssertions(report) {
  const suites = report.testResults ?? [];
  return suites.flatMap((suite) => {
    const assertions = suite.assertionResults ?? [];
    return assertions.map((assertion) => {
      const fullName = assertion.fullName
        ?? [...(assertion.ancestorTitles ?? []), assertion.title].filter(Boolean).join(" ");
      return {
        fullName,
        status: assertion.status
      };
    });
  });
}

function printCapturedOutput(result) {
  if (result.stdout) {
    console.log(result.stdout.trim());
  }
  if (result.stderr) {
    console.error(result.stderr.trim());
  }
}
