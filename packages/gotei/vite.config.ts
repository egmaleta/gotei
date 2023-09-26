import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: ["src/index.js"],
			formats: ["es", "umd"],
			name: "gotei",
			fileName: (format) => `gotei.${format === "es" ? "esm" : format}.js`,
		},
		minify: true,
	},
});
