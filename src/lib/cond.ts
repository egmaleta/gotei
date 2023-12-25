import { Gotei } from "./ns";
import { effect } from "./state";
import { OrComputed } from "./utils";

class CondVNode<T extends Node> implements Gotei.VNode<T | Comment | null> {
  constructor(
    private vnode: Gotei.VNode<T>,
    private condition: OrComputed<boolean>
  ) {}

  render() {
    const { condition, vnode } = this;

    if (typeof condition !== "function") {
      return condition ? vnode.render() : null;
    }

    const placeholder = document.createComment(
      "gotei conditional node placeholder"
    );

    let node: T | null = null;

    effect(() => {
      if (condition()) {
        if (!node) {
          node = vnode.render();
        }
        placeholder.parentNode?.replaceChild(node, placeholder);
      } else {
        node?.parentNode?.replaceChild(placeholder, node);
      }
    });

    return node ?? placeholder;
  }
}

export function show<T extends Node>(
  vnode: Gotei.VNode<T>,
  condition: OrComputed<boolean>
) {
  return new CondVNode(vnode, condition);
}
