import type { LeadOpsRepository } from "./repository";

export function runInTransaction<T>(repository: LeadOpsRepository, operation: () => T): T {
  const before = repository.snapshot();

  try {
    return operation();
  } catch (error) {
    repository.restore(before);
    throw error;
  }
}
