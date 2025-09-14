import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: "src",
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          dir: "src/application/use-cases",
          include: ["**/*.{test,unit.spec}.?(c|m)[jt]s?(x)"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          dir: "src/application/use-cases",
          include: ["**/*.{test,integration.spec}.?(c|m)[jt]s?(x)"],
          environment:
            "./prisma/vitest-environment-prisma/prisma-test-environment.ts",
        },
      },
    ],
    coverage: {
      include: ["src/application/use-cases/**"],
    },
  },
});
