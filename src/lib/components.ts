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
