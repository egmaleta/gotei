import { rm } from "node:fs/promises";
import dts from "bun-plugin-dts";

async function build(target, minify, genTypes) {
	const targetName = target === "browser" ? "" : `.${target}`;

	await Bun.build({
		entrypoints: ["./src/gotei.ts"],
		outdir: "./dist",
		target,
		format: "esm",
		minify,
		plugins: genTypes ? [dts()] : [],
		naming: `[dir]/[name]${targetName}.[ext]`,
	});
}

await rm("./dist", { recursive: true });

await Promise.allSettled([
	build("browser", true, true),
	build("bun", false, false),
	build("node", false, false),
]);
