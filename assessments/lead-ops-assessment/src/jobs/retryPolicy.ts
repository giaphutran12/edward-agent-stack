import type { CrmFixtureResponse, CrmSyncJob } from "../domain/types";

const DEFAULT_RETRY_DELAY_MS = 60_000;
const MAX_ATTEMPTS = 3;

export function nextJobState(job: CrmSyncJob, response: CrmFixtureResponse, now: string): CrmSyncJob {
  if (response.status >= 200 && response.status < 300) {
    return {
      ...job,
      status: "completed",
      attemptCount: job.attemptCount + 1,
      lastResponseCode: response.status,
      lastError: null,
      updatedAt: now
    };
  }

  const attemptCount = job.attemptCount + 1;
  const retryable = response.status === 409 || response.status === 429 || response.status >= 500;
  if (retryable && attemptCount < MAX_ATTEMPTS) {
    return {
      ...job,
      status: "retry_scheduled",
      attemptCount,
      nextRunAt: new Date(Date.parse(now) + retryDelayMs(response)).toISOString(),
      lastResponseCode: response.status,
      lastError: String(response.body.message ?? "CRM sync retry scheduled"),
      updatedAt: now
    };
  }

  return {
    ...job,
    status: "dead_lettered",
    attemptCount,
    lastResponseCode: response.status,
    lastError: String(response.body.message ?? "CRM sync failed permanently"),
    updatedAt: now
  };
}

export function retryDelayMs(response: CrmFixtureResponse): number {
  const retryAfter = response.headers?.["Retry-After"];
  if (!retryAfter) {
    return DEFAULT_RETRY_DELAY_MS;
  }

  const seconds = Number.parseInt(retryAfter, 10);
  return Number.isFinite(seconds) ? seconds * 1000 : DEFAULT_RETRY_DELAY_MS;
}
