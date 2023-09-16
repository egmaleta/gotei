import { rm } from "node:fs/promises";
import dts from "bun-plugin-dts";

async function buildBrowser(minify = true) {
	const minSuffix = minify ? "-min" : "";

	await Bun.build({
		entrypoints: ["./src/index.ts"],
		outdir: "./dist",
		target: "browser",
		format: "esm",
		minify,
		naming: `[dir]/gotei${minSuffix}.[ext]`,
	});
}

async function buildNode() {
	await Bun.build({
		entrypoints: ["./src/index.ts"],
		outdir: "./dist",
		target: "node",
		format: "esm",
		plugins: [dts()],
		naming: "[dir]/[name].[ext]",
	});
}

await rm("./dist", { recursive: true });
await Promise.allSettled([buildNode(), buildBrowser()]);
