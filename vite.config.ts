import tsConfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsConfigPaths()],
  test: {
    dir: "src",
    globals: true,
    coverage: {
      include: ["src/use-cases/**"],
    },
  },
});
