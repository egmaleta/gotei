import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: ["src/gotei.ts"],
			formats: ["es", "umd"],
			name: "gotei",
			fileName: (format, name) =>
				`${name}.${format === "es" ? "esm" : format}.js`,
		},
		minify: true,
		emptyOutDir: false,
	},
});
