import { pathToFileURL } from "node:url";
import type { CrmSyncJob } from "../domain/types";
import {
  FakeCrmClient,
  fakeCrmScenarios,
  isFakeCrmScenario,
  type FakeCrmScenario
} from "../integrations/fakeCrmClient";
import { defaultRepository } from "../repository/repository";
import type { LeadOpsRepository } from "../repository/repository";
import { nextJobState } from "./retryPolicy";

export interface CrmSyncWorkerOptions {
  now?: string;
  maxJobs?: number;
}

export interface CrmSyncWorkerCliOptions {
  scenario: FakeCrmScenario;
  now: string;
  maxJobs: number;
}

export function processNextCrmSyncJob(
  repository: LeadOpsRepository,
  crmClient: FakeCrmClient,
  now: string
): CrmSyncJob | null {
  const job = repository
    .listCrmSyncJobs()
    .find((candidate) => isDueCrmSyncJob(candidate, now));

  if (!job) {
    return null;
  }

  const response = crmClient.upsertLead(job.leadId);
  const nextJob = nextJobState(job, response, now);
  repository.updateCrmSyncJob(nextJob);

  if (nextJob.status === "dead_lettered") {
    repository.addDeadLetterJob({
      id: `dlq_${nextJob.id}`,
      originalJobId: nextJob.id,
      leadId: nextJob.leadId,
      terminalReason: nextJob.lastError ?? "CRM sync failed permanently",
      responseCode: nextJob.lastResponseCode,
      payloadSnapshot: { operation: nextJob.operation, leadId: nextJob.leadId },
      createdAt: now
    });
  }

  return nextJob;
}

export function processDueCrmSyncJobs(
  repository: LeadOpsRepository,
  crmClient: FakeCrmClient,
  options: CrmSyncWorkerOptions = {}
): CrmSyncJob[] {
  const now = options.now ?? new Date().toISOString();
  const maxJobs = options.maxJobs ?? Number.POSITIVE_INFINITY;
  const processedJobs: CrmSyncJob[] = [];

  while (processedJobs.length < maxJobs) {
    const job = processNextCrmSyncJob(repository, crmClient, now);
    if (!job) {
      return processedJobs;
    }

    processedJobs.push(job);
  }

  return processedJobs;
}

export function isDueCrmSyncJob(job: CrmSyncJob, now: string): boolean {
  return (job.status === "pending" || job.status === "retry_scheduled") && job.nextRunAt <= now;
}

export function parseCrmSyncWorkerArgs(args: string[]): CrmSyncWorkerCliOptions {
  let scenario: FakeCrmScenario = "success";
  let now = new Date().toISOString();
  let maxJobs = Number.POSITIVE_INFINITY;

  for (const arg of args) {
    if (arg.startsWith("--scenario=")) {
      const value = arg.slice("--scenario=".length);
      if (!isFakeCrmScenario(value)) {
        throw new Error(
          `Invalid CRM scenario "${value}". Expected one of: ${fakeCrmScenarios.join(", ")}.`
        );
      }
      scenario = value;
      continue;
    }

    if (arg.startsWith("--now=")) {
      now = arg.slice("--now=".length);
      if (Number.isNaN(Date.parse(now))) {
        throw new Error(`Invalid --now ISO timestamp: ${now}`);
      }
      continue;
    }

    if (arg.startsWith("--max-jobs=")) {
      const value = Number.parseInt(arg.slice("--max-jobs=".length), 10);
      if (!Number.isFinite(value) || value < 1) {
        throw new Error("--max-jobs must be a positive integer.");
      }
      maxJobs = value;
      continue;
    }

    throw new Error(`Unknown crm_sync worker argument: ${arg}`);
  }

  return { scenario, now, maxJobs };
}

export function runCrmSyncWorker(args = process.argv.slice(2)): CrmSyncJob[] {
  const options = parseCrmSyncWorkerArgs(args);
  const jobs = processDueCrmSyncJobs(defaultRepository, new FakeCrmClient(options.scenario), {
    now: options.now,
    maxJobs: options.maxJobs
  });

  console.log(
    JSON.stringify(
      {
        worker: "crm_sync",
        scenario: options.scenario,
        now: options.now,
        processed: jobs.length,
        jobs: jobs.map((job) => ({
          id: job.id,
          leadId: job.leadId,
          status: job.status,
          attemptCount: job.attemptCount,
          nextRunAt: job.nextRunAt,
          lastResponseCode: job.lastResponseCode,
          lastError: job.lastError
        }))
      },
      null,
      2
    )
  );

  return jobs;
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;

if (invokedPath === import.meta.url) {
  try {
    runCrmSyncWorker();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
