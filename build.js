import { rm } from "node:fs/promises";
import dts from "bun-plugin-dts";

await rm("./dist", { recursive: true });

await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	target: "browser",
	format: "esm",
	minify: true,
	plugins: [dts()],
});
