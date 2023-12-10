import { Gotei, MountContext } from "./types";

export function* flatten(possibleArray: any): Generator<any> {
  if (!Array.isArray(possibleArray)) yield possibleArray;
  else {
    for (const x of possibleArray) for (const y of flatten(x)) yield y;
  }
}

export function mountChildren(ctx: MountContext, children: Gotei.Child[]) {
  const nodes: Node[] = [];

  for (const child of children) {
    if (typeof child === "function") {
      const mounted = child(ctx);

      if (Array.isArray(mounted)) {
        nodes.push(...mounted);
      } else if (mounted) {
        nodes.push(mounted);
      }
    } else if (typeof child === "string" || typeof child === "number") {
      nodes.push(
        ctx.parentNode.appendChild(document.createTextNode(`${child}`))
      );
      ctx.increaseChildIndex();
    }
  }

  return nodes;
}

export function mount(node: Node, to: ParentNode, at?: number) {
  if (typeof at === "undefined" || at >= to.childNodes.length) {
    to.appendChild(node);
  } else {
    to.insertBefore(node, to.childNodes.item(at));
  }
}
