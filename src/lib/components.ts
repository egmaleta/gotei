import { html } from "./html";
import { MountFunction } from "./mount";
import { Gotei } from "./ns";
import { effect } from "./state";
import { AnyProps, OrArray, OrComputed } from "./type-utils";
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

  return (parent) => {
    parent.appendChild(text);
    return text;
  };
}

export function show<T extends Node>(
  mf: MountFunction<T>,
  condition: () => boolean
): MountFunction<T | null> {
  return (parent, index) => {
    let node: T | null = null;

    effect(() => {
      if (condition()) {
        if (!node) {
          node = mf(parent, index);
        } else {
          mount(node, parent, index);
        }
      } else {
        node && parent.removeChild(node);
      }
    });

    return node;
  };
}

export function fc<P extends AnyProps, C extends Gotei.Child>(
  f: Gotei.Component<P, C>,
  props: P,
  ...children: OrArray<C>[]
): MountFunction<OrArray<Node>> {
  const flattenedChildren = [...flatten(children)];

  return (parent, index) => {
    const mounted = mountChildren(
      [...flatten(f(props, flattenedChildren))],
      parent,
      index
    );

    return mounted.length === 1 ? mounted[0] : mounted;
  };
}

function list<
  T extends "ul" | "ol",
  O extends Record<string, any>,
  K extends keyof O,
>(
  tag: T,
  props: Gotei.Attrs<T>,
  items: () => O[],
  key: K,
  f: (item: O) => MountFunction<Node>
): MountFunction<HTMLElementTagNameMap[T]> {
  return (listParent, index) => {
    const parent = html(tag, props, [])(listParent, index);

    const cache = new Map<O[K], Node>();
    effect(() => {
      for (const node of cache.values()) parent.removeChild(node);

      const pairs: (readonly [O[K], Node])[] = [];
      let index = 0;
      for (const item of items()) {
        const id = item[key];

        let node = cache.get(id);
        if (node) {
          parent.appendChild(node);
        } else {
          node = f(item)(parent, index);
        }

        pairs.push([id, node]);
        index++;
      }

      cache.clear();
      for (const [id, node] of pairs) cache.set(id, node);
    });

    return parent;
  };
}

export function ulist<T extends object, K extends keyof T>(
  props: Gotei.Attrs<"ul">,
  items: () => T[],
  key: K,
  f: (item: T) => MountFunction<Node>
): MountFunction<HTMLUListElement>;
export function ulist<T extends object, K extends keyof T>(
  items: () => T[],
  key: K,
  f: (item: T) => MountFunction<Node>
): MountFunction<HTMLUListElement>;
export function ulist(...args: any[]): MountFunction<HTMLUListElement> {
  if (args.length === 4) {
    // @ts-ignore
    return list("ul", args[0], args[1], args[2], args[3]);
  }
  // @ts-ignore
  return list("ul", {}, args[0], args[1], args[2]);
}

export function olist<T extends object, K extends keyof T>(
  props: Gotei.Attrs<"ol">,
  items: () => T[],
  key: K,
  f: (item: T) => MountFunction<Node>
): MountFunction<HTMLOListElement>;
export function olist<T extends object, K extends keyof T>(
  items: () => T[],
  key: K,
  f: (item: T) => MountFunction<Node>
): MountFunction<HTMLOListElement>;
export function olist(...args: any[]): MountFunction<HTMLOListElement> {
  if (args.length === 4) {
    // @ts-ignore
    return list("ol", args[0], args[1], args[2], args[3]);
  }
  // @ts-ignore
  return list("ol", {}, args[0], args[1], args[2]);
}
