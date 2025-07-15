import { defineConfig } from "vitest/config";
import { readdirSync, statSync } from "node:fs";
import { resolve, join, relative, basename, dirname } from "node:path";

function findBrowserFiles(dir: string, aliases: Record<string, string> = {}, srcRoot: string = dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      findBrowserFiles(fullPath, aliases, srcRoot);
    } else if (entry.endsWith("-browser.mts")) {
      const rel = relative(srcRoot, fullPath);
      const baseName = basename(entry, "-browser.mts");
      const dirName = dirname(rel);

      // Alias for deep import from src root
      const deepImport = "../../src/" + join(dirName, baseName + ".js");
      aliases[deepImport] = resolve(fullPath);

      // Alias for relative import from same directory (e.g., "./encoding.js")
      const relativeImport = "./" + baseName + ".js";
      aliases[relativeImport] = resolve(fullPath);
    }
  }
  return aliases;
}

const srcDir = resolve("./src");
const aliases = findBrowserFiles(srcDir);

export default defineConfig({
  test: {
    alias: {
      ...aliases,
      // Fix for random import in delay module
      "../crypto/random.js": resolve("./src/crypto/random-browser.mts"),
    },
    typecheck: {
      enabled: true,
      tsconfig: "tsconfig.test.json",
      include: ["test/**/*.ts", "test/**/*.mts", "test/**/*.cts"],
    },
    testTimeout: 18000,
    reporters: ["default", "junit"],
    outputFile: {
      junit: "test-results.browser.xml",
    },
    include: ["test/**/*.spec.ts"],
    browser: {
      instances: [
        {
          browser: "chromium",
          launch: {
            args: ["--disable-web-security"],
          },
        },
      ],
      enabled: true,
      headless: true,
      provider: "playwright",
    },
    fakeTimers: {
      toFake: ["setTimeout", "Date"],
    },
    watch: false,
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*./*-browser.mts",
        "src/**/*./*-react-native.mts",
      ],
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      reportsDirectory: "coverage-browser",
    },
  },
});
