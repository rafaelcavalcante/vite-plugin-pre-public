/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "vitest.setup.ts",
    watch: false,
    coverage: {
      reporter: ["html"],
      include: ["src/**/*.test.*"],
    },
  },
});
