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

    const { parent, childIndex } = ctx;

    let node: Node | null = null;
    new Effect(() => {
      if (condition()) {
        if (!node) {
          node = mf(ctx);
        } else {
          parent && mount(node, parent, childIndex);
        }
      } else {
        node && parent?.removeChild(node);
      }
    }, true);

    return node;
  };
}
