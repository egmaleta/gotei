import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["./src/lib/state.ts"],
      formats: ["umd"],
      name: "St",
      fileName: () => `gotei-state.js`,
    },
    target: "ES2015",
    outDir: ".",
    emptyOutDir: false,
    minify: false,
  },
});
