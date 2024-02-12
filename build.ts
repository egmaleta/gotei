import { build as viteBuild } from "vite";

function build(minify: boolean) {
  return viteBuild({
    build: {
      lib: {
        entry: ["src/index.ts"],
        formats: ["umd"],
        name: "gotei",
        fileName: () => "gotei" + (minify ? ".min" : "") + ".js",
      },
      target: "ES2015",
      minify,
      emptyOutDir: false,
    },
  });
}

await Promise.all([build(true), build(false)]);
