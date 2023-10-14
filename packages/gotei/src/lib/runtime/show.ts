import { Effect } from "../state/effect";
import { MountFunction, OrComputed, mount } from "./utils";

export function show<T extends Node>(
  mf: MountFunction<T>,
  condition: OrComputed<boolean>
): MountFunction<T | null> {
  return (ctx) => {
    if (typeof condition !== "function") {
      return condition ? mf(ctx) : null;
    }

    const { document, parent, childIndex } = ctx;

    let node: T | null = null;
    new Effect(() => {
      if (condition()) {
        if (!node) {
          node = mf({ document, parent, childIndex });
        } else {
          mount(node, parent, childIndex);
        }
      } else {
        node && parent.removeChild(node);
      }
    }, true);

    ctx.childIndex++;

    return node;
  };
}
