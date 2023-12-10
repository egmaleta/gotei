import { MountFunction, MountContext as IMC } from "./types";

export class MountContext implements IMC {
  private _childIndex: number;

  constructor(
    readonly parentNode: ParentNode,
    childIndex?: number
  ) {
    if (typeof childIndex === "undefined") {
      this._childIndex = parentNode.childNodes.length;
    } else {
      this._childIndex = childIndex;
    }
  }

  get childIndex() {
    return this._childIndex;
  }

  increaseChildIndex() {
    this._childIndex++;
  }
}

export function mount<T extends Node>(mf: MountFunction<T>, to: ParentNode) {
  return mf(new MountContext(to));
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
  return mf(new MountContext(parent, index));
}
