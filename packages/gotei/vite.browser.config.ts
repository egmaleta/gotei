import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["./src/browser.js"],
      formats: ["es", "umd"],
      name: "gotei",
      fileName: (format) => `gotei.${format === "es" ? "esm" : format}.js`,
    },
    minify: true,
    emptyOutDir: false,
    target: "ES2015",
  },
});
