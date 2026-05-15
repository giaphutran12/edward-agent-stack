import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const assessmentRoot = path.resolve(scriptDir, "..");
const tempRoot = mkdtempSync(path.join(tmpdir(), "lead-ops-answer-key-"));
const verifyDir = path.join(tempRoot, "package");
const excludedTopLevel = new Set([".git", "coverage", "dist", "node_modules", "tmp"]);

let shouldKeepTemp = process.env.LEAD_OPS_KEEP_ANSWER_KEY_COPY === "1";

try {
  copyAssessmentPackage();
  run("npm", ["ci"]);
  run("git", ["apply", "--check", "reviewer/model-solution.patch"]);
  run("git", ["apply", "reviewer/model-solution.patch"]);
  run("npm", ["run", "typecheck"]);
  run("npm", ["run", "test:public"]);
  run("npm", ["run", "reviewer:verify-hidden"]);

  console.log("Answer-key verification passed.");
} catch (error) {
  shouldKeepTemp = true;
  console.error(error instanceof Error ? error.message : String(error));
  console.error(`Answer-key verification copy kept: ${verifyDir}`);
  process.exitCode = 1;
} finally {
  if (!shouldKeepTemp) {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

function copyAssessmentPackage() {
  cpSync(assessmentRoot, verifyDir, {
    recursive: true,
    filter(source) {
      const relativePath = path.relative(assessmentRoot, source);
      if (relativePath === "") {
        return true;
      }

      const [topLevel] = relativePath.split(path.sep);
      return !excludedTopLevel.has(topLevel);
    }
  });
}

function run(command, args) {
  console.log(`Running in answer-key copy: ${[command, ...args].join(" ")}`);

  const result = spawnSync(command, args, {
    cwd: verifyDir,
    encoding: "utf8",
    env: {
      ...process.env,
      FORCE_COLOR: "0"
    },
    stdio: "inherit"
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`Command failed with exit ${result.status}: ${[command, ...args].join(" ")}`);
  }
}
