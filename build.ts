import { build } from "vite";
import dts from "vite-plugin-dts";

await build({
  build: {
    lib: {
      entry: ["src/index.ts", "src/runtime.ts", "src/state.ts"],
      formats: ["es"],
      fileName: (_, name) => `${name}.js`,
    },
    target: "ES2015",
    minify: false,
  },
  plugins: [dts()],
});

await build({
  build: {
    lib: {
      entry: ["./src/gotei.js"],
      formats: ["umd"],
      name: "Gotei",
      fileName: (_, name) => `${name}.js`,
    },
    target: "ES2015",
    emptyOutDir: false,
    minify: false,
  },
});

await build({
  build: {
    lib: {
      entry: ["./src/signals.js"],
      formats: ["umd"],
      name: "Signals",
      fileName: (_, name) => `${name}.js`,
    },
    target: "ES2015",
    emptyOutDir: false,
    minify: false,
  },
});
