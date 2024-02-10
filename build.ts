import { build } from "vite";

await build({
  build: {
    lib: {
      entry: ["src/index.ts"],
      formats: ["umd"],
      name: "gotei",
      fileName: () => `gotei.js`,
    },
    target: "ES2015",
    minify: false,
  },
});
