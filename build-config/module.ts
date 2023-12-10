import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: ["src/index.ts", "src/runtime.ts", "src/state.ts"],
      formats: ["es"],
      fileName: (_, name) => `${name}.js`,
    },
    minify: false,
    rollupOptions: {
      external: ["happy-dom"],
    },
    target: "ES2015",
  },
  plugins: [dts()],
});
