import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["./src/gotei-state.js"],
      formats: ["umd"],
      name: "St",
      fileName: (_, name) => `${name}.js`,
    },
    target: "ES2015",
    outDir: ".",
    emptyOutDir: false,
    minify: false,
  },
});
