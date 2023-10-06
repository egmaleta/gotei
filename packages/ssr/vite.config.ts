import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: ["src/index.ts"],
			formats: ["es", "cjs"],
			fileName: (format, name) => `${name}.${format === "cjs" ? format : "js"}`,
		},
		minify: false,
	},
});
