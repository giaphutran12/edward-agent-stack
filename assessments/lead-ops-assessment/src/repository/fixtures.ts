import type { AppState } from "../domain/types";
import seedState from "../../fixtures/repository/seed-state.json";

export const FIXED_NOW = "2026-05-16T00:00:00.000Z";

export function createInitialState(): AppState {
  return structuredClone(seedState) as AppState;
}
