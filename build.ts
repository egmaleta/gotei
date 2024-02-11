import { build as viteBuild } from "vite";
import { version } from "./package.json";

const NAME = "gotei";
const VERSIONED_NAME = `${NAME}-${version}`;

function build(name: string, minify: boolean) {
  return viteBuild({
    build: {
      lib: {
        entry: ["src/index.ts"],
        formats: ["umd"],
        name: "gotei",
        fileName: () => name + (minify ? ".min" : "") + ".js",
      },
      target: "ES2015",
      minify,
      emptyOutDir: false,
    },
  });
}

await Promise.all([
  build(NAME, true),
  build(NAME, false),
  build(VERSIONED_NAME, true),
  build(VERSIONED_NAME, false),
]);
