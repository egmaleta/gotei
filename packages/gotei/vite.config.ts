import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: ["src/index.ts", "src/runtime.ts", "src/state.ts", "src/ssr.ts"],
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format === "cjs" ? format : "js"}`,
    },
    minify: false,
    rollupOptions: {
      external: ["happy-dom"],
    },
  },
  plugins: [dts()],
});
