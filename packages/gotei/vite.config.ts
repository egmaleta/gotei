import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: ["src/index.ts"],
			formats: ["es", "umd"],
			name: "gotei",
			fileName: (format) => `gotei.${format === "es" ? "esm" : format}.js`,
		},
		minify: true,
	},
});
