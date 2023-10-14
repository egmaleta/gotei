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
  const doc = document ?? globalThis.document;
  return mf({
    document: doc,
    parent: doc.createDocumentFragment(),
    childIndex: 0,
  });
}

export function mount<T extends Node>(
  mf: MountFunction<T>,
  to: ParentNode,
  document?: IDocument
) {
  return mf({
    document: document ?? globalThis.document,
    parent: to,
    childIndex: to.childNodes.length,
  });
}

export function replace<T extends Node>(
  node: Node,
  mf: MountFunction<T>,
  document?: IDocument
) {
  const parent = node.parentNode;
  if (!parent)
    throw new Error("Couldn't replace 'node'! 'node' has no parent node.");

  let index = 0;
  for (const child of parent.childNodes) {
    if (node.isSameNode(child)) break;
    index++;
  }

  parent.removeChild(node);
  return mf({
    document: document ?? globalThis.document,
    parent,
    childIndex: index,
  });
}
