import { defaultRepository } from "./repository";

export function resetDemoState(): void {
  defaultRepository.reset();
}
