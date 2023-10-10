import { RenderFunction, RenderContext, IDocument } from "./utils";

export type { RenderFunction, RenderContext, IDocument };
export type { Gotei } from "./ns";

export * from "./h";
export * from "./text";
export * from "./array";
export * from "./conditional";

export function render<T extends Node>(
  rf: RenderFunction<T>,
  document?: IDocument
) {
  return rf({ document: document ?? globalThis.document });
}

export function mount<T extends Node>(
  rf: RenderFunction<T>,
  to: ParentNode,
  document?: IDocument
) {
  return rf({ parent: to, document: document ?? globalThis.document });
}

export function replace<T extends Node>(
  node: Node,
  rf: RenderFunction<T>,
  document?: IDocument
) {
  const parent = node.parentNode;
  if (!parent) return;

  let index = 0;
  for (const child of parent?.childNodes) {
    if (node.isSameNode(child)) break;
    index++;
  }

  parent.removeChild(node);
  return rf({
    parent,
    document: document ?? globalThis.document,
    childIndex: index,
  });
}
