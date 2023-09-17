import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: ["src/index.ts", "src/runtime.ts", "src/state.ts"],
			formats: ["es"],
			fileName: (_, name) => `${name}.js`,
		},
		minify: false,
	},
});
