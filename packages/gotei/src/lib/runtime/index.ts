import { RenderFunction, RenderContext, IDocument } from "./utils";

export type { RenderFunction, RenderContext, IDocument };
export type { Gotei } from "./ns";

export * from "./h";
export * from "./text";
export * from "./array";
export * from "./conditional";

export function render<T extends Node>(
  rf: RenderFunction<T>,
  document?: IDocument,
) {
  return rf({ document: document ?? globalThis.document });
}
