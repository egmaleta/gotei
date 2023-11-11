import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["./src/gotei.js"],
      formats: ["umd"],
      name: "Gotei",
      fileName: (_, name) => `${name}.js`,
    },
    target: "ES2015",
    outDir: ".",
    emptyOutDir: false,
    minify: false,
  },
});
