import { Gotei } from "./ns";

export type OrArray<T> = T | T[];
export type OrComputed<T> = T | (() => T);

export function setCSSVar(el: HTMLElement, prop: string, value: string) {
  el.style.setProperty(prop, value);
}

export function setCSSProp(el: HTMLElement, prop: string, value: string) {
  // @ts-ignore
  el.style[prop] = value;
}

const WHITESPACE = /\s+/;

export function cls2Tokens(cls: string) {
  return cls.trim().split(WHITESPACE);
}

export function addEventListener(
  target: EventTarget,
  name: string,
  handler: any
) {
  const handlers = Array.isArray(handler) ? handler : [handler];

  for (const handler of handlers) {
    if (typeof handler === "function") {
      target.addEventListener(name, handler);
    } else {
      target.addEventListener(name, handler.handler, handler.options);
    }
  }
}

export function setAttribute(el: Element, name: string, attr: any) {
  if (typeof attr === "string" || typeof attr === "number") {
    el.setAttribute(name, `${attr}`);
  } else if (attr === true) {
    el.setAttribute(name, "");
  } else {
    el.removeAttribute(name);
  }
}

export function extractAttr<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  attr: K
) {
  const value = obj[attr];
  delete obj[attr];

  return value;
}

export function renderChildren(children: Gotei.Child[]) {
  const nodes = [];
  for (const child of children) {
    if (
      typeof child === "undefined" ||
      typeof child === "boolean" ||
      child === null
    ) {
      continue;
    }

    if (typeof child === "string" || typeof child === "number") {
      nodes.push(document.createTextNode(`${child}`));
    } else {
      const rendered = child.render();
      if (rendered) {
        if (Array.isArray(rendered)) {
          nodes.push(...rendered);
        } else {
          nodes.push(rendered);
        }
      }
    }
  }

  return nodes;
}

export function flatten(items: OrArray<any>[]): any[] {
  const l = [];

  for (const item of items) {
    if (Array.isArray(item)) {
      l.push(...flatten(item));
    } else {
      l.push(item);
    }
  }

  return l;
}

export const $HOOKS = Symbol();

function execHooks(node: Node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    if ($HOOKS in node) {
      // @ts-ignore
      for (const hook of node[$HOOKS]) hook();
    }
    for (const child of node.childNodes) execHooks(child);
  }
}

export function mount(to: ParentNode, ...children: OrArray<Gotei.Child>[]) {
  for (const node of renderChildren(flatten(children))) {
    to.appendChild(node);
    execHooks(node);
  }
}
