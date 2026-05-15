import type { AppState } from "../domain/types";
import { defaultRepository } from "./repository";

export function resetDemoState(): AppState {
  defaultRepository.reset();
  return defaultRepository.snapshot();
}
