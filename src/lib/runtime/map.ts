import { effect } from "../state";
import { MountFunction } from "./utils";

export function map<T extends object, K extends keyof T>(
  items: () => T[],
  key: K,
  f: (item: T) => MountFunction<Node>
): MountFunction<Node[]> {
  return (ctx) => {
    const cache = new Map<T[K], Node>();

    effect(() => {
      for (const node of cache.values()) ctx.parent.removeChild(node);

      const pairs: (readonly [T[K], Node])[] = [];
      let index = 0;
      for (const item of items()) {
        const id = item[key];

        let node = cache.get(id);
        if (node) {
          ctx.parent.appendChild(node);
        } else {
          node = f(item)({
            document: ctx.document,
            parent: ctx.parent,
            childIndex: index,
          });
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
