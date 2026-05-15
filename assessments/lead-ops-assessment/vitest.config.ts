import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    exclude: [...configDefaults.exclude, "tmp/**"],
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      reporter: ["text", "html"]
    }
  }
});
