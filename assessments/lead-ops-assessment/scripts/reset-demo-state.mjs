import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const seedPath = resolve(appRoot, "fixtures/repository/seed-state.json");
const outputPath = resolve(appRoot, "tmp/demo-state.json");

const seedState = JSON.parse(await readFile(seedPath, "utf8"));

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(seedState, null, 2)}\n`);

console.log(
  [
    "Reset demo state",
    `${seedState.leads.length} leads`,
    `${seedState.inboundEvents.length} inbound events`,
    `${seedState.crmSyncJobs.length} CRM sync jobs`,
    `${seedState.deadLetterJobs.length} DLQ jobs`,
    `wrote ${outputPath}`
  ].join(" | ")
);
