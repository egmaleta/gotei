import { OrArray } from "./type-utils";

export type MountFunction<
  T extends OrArray<Node> | null = OrArray<Node> | null,
> = {
  (parent: ParentNode, index: number): T;
};

export function mount<T extends Node>(mf: MountFunction<T>, to: ParentNode) {
  return mf(to, to.childNodes.length);
}

export function replace<T extends Node>(node: Node, mf: MountFunction<T>) {
  const parent = node.parentNode;
  if (!parent) {
    return false;
  }

  let index = 0;
  for (const child of parent.childNodes) {
    if (node.isSameNode(child)) break;
    index++;
  }
  if (index === parent.childNodes.length) {
    return false;
  }

  parent.removeChild(node);
  return mf(parent, index);
}
