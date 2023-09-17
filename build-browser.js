async function build(minify = true) {
	const mark = minify ? ".min" : "";

	await Bun.build({
		entrypoints: ["./src/gotei.ts"],
		outdir: "./dist",
		target: "browser",
		format: "esm",
		minify,
		naming: `[dir]/[name]${mark}.[ext]`,
	});
}

await build();
