import { MountContext } from "./mount";
import { effect } from "./state";
import { AnyProps, Gotei, MountFunction, OrArray, OrComputed } from "./types";
import { flatten, mount, mountChildren } from "./utils";

type TextRenderizable = string | number | boolean;

export function text<T extends TextRenderizable>(
  data: OrComputed<T>
): MountFunction<Text> {
  const text = document.createTextNode("");

  if (typeof data !== "function") {
    text.data = `${data}`;
  } else {
    effect(() => {
      text.data = `${data()}`;
    });
  }

  return (ctx) => {
    ctx.parentNode.appendChild(text);
    ctx.increaseChildIndex();

    return text;
  };
}

export function show<T extends Node>(
  mf: MountFunction<T>,
  condition: OrComputed<boolean>
): MountFunction<T | null> {
  return (ctx) => {
    if (typeof condition !== "function") {
      return condition ? mf(ctx) : null;
    }

    const { parentNode, childIndex } = ctx;

    let node: T | null = null;
    effect(() => {
      if (condition()) {
        if (!node) {
          node = mf(new MountContext(parentNode, childIndex));
        } else {
          mount(node, parentNode, childIndex);
        }
      } else {
        node && parentNode.removeChild(node);
      }
    });

    ctx.increaseChildIndex();

    return node;
  };
}

export function list<T extends object, K extends keyof T>(
  items: () => T[],
  key: K,
  f: (item: T) => MountFunction<Node>
): MountFunction<Node[]> {
  return (ctx) => {
    const { parentNode } = ctx;
    const cache = new Map<T[K], Node>();

    effect(() => {
      for (const node of cache.values()) parentNode.removeChild(node);

      const pairs: (readonly [T[K], Node])[] = [];
      let index = 0;
      for (const item of items()) {
        const id = item[key];

        let node = cache.get(id);
        if (node) {
          parentNode.appendChild(node);
        } else {
          node = f(item)(new MountContext(parentNode, index));
        }

        pairs.push([id, node]);
        index++;
      }

      cache.clear();
      for (const [id, node] of pairs) cache.set(id, node);
    });

    return [...cache.values()];
  };
}

export function fc<P extends AnyProps, C extends Gotei.Child>(
  component: Gotei.Component<P, C>,
  props: P,
  ...children: OrArray<C>[]
): MountFunction<OrArray<Node>> {
  const flattenedChildren = [...flatten(children)];

  return (ctx) => {
    const mounted = mountChildren(ctx, [
      ...flatten(component(props, flattenedChildren)),
    ]);

    return mounted.length === 1 ? mounted[0] : mounted;
  };
}
