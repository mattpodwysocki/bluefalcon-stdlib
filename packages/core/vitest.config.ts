import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 18000,
    reporters: ["default", "junit"],
    outputFile: {
      junit: "test-results.xml",
    },
    fakeTimers: {
      toFake: ["setTimeout", "Date"],
    },
    watch: false,
    include: ["test/**/*.spec.ts"],
    exclude: [
      "test/**/browser/*.spec.ts",
    ],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*-browser.mts",
        "src/**/*-react-native.mts",
        "vitest*.config.ts",
      ],
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      reportsDirectory: "coverage",
    },
    typecheck: {
      enabled: true,
      tsconfig: "tsconfig.test.json",
      include: ["test/**/*.ts", "test/**/*.mts", "test/**/*.cts"],
    },
  },
});
