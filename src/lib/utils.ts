import { Gotei } from "./ns";

export function* flatten(possibleArray: any): Generator<any> {
  if (!Array.isArray(possibleArray)) yield possibleArray;
  else {
    for (const x of possibleArray) for (const y of flatten(x)) yield y;
  }
}

export function mountChildren(
  children: Gotei.Child[],
  parent: ParentNode,
  index: number
) {
  const nodes: Node[] = [];
  let i = index;

  for (const child of children) {
    if (typeof child === "function") {
      const mounted = child(parent, i);

      if (Array.isArray(mounted)) {
        nodes.push(...mounted);
        i += mounted.length;
      } else if (mounted) {
        nodes.push(mounted);
        i++;
      }
    } else if (typeof child === "string" || typeof child === "number") {
      nodes.push(parent.appendChild(document.createTextNode(`${child}`)));
      i++;
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
