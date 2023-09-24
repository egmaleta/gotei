import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: ["src/browser.ts"],
			formats: ["es", "umd"],
			name: "gotei",
			fileName: (format, name) =>
				`gotei.${format === "es" ? "esm" : format}.js`,
		},
		minify: true,
		emptyOutDir: false,
	},
});
