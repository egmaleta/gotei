import { MountFunction, MountContext, IDocument } from "./utils";

export type { MountFunction, MountContext, IDocument };
export type { Gotei } from "./ns";

export * from "./h";
export * from "./text";
export * from "./map";
export * from "./show";

export function render<T extends Node>(
  mf: MountFunction<T>,
  document?: IDocument
) {
  return mf({ document: document ?? globalThis.document });
}

export function mount<T extends Node>(
  mf: MountFunction<T>,
  to: ParentNode,
  document?: IDocument
) {
  return mf({ parent: to, document: document ?? globalThis.document });
}

export function replace<T extends Node>(
  node: Node,
  mf: MountFunction<T>,
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
  return mf({
    parent,
    document: document ?? globalThis.document,
    childIndex: index,
  });
}
