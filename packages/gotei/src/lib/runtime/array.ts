import { Effect } from "../state/effect";
import { RenderFunction } from "./utils";

export function map<T extends object, K extends keyof T>(
  items: () => T[],
  key: K,
  f: (item: T) => RenderFunction<Node>
): RenderFunction<Node[]> {
  return (ctx) => {
    const { parent, document } = ctx;

    if (!parent) return [];

    const cache = new Map<T[K], Node>();
    let currentIds: T[K][] = [];

    new Effect((effectCtx: { op: string; [arg: string]: any } | null) => {
      if (!effectCtx) {
        // first render
        for (const item of items()) {
          const id = item[key];
          const rf = f(item);
          const node = rf({ parent, document });

          cache.set(id, node);
          currentIds.push(id);
        }
      } else {
        const { op } = effectCtx;
        if (op === "setat") {
          const { index } = effectCtx;

          // remove old node
          const oldId = currentIds[index];
          const oldNode = cache.get(oldId);
          cache.delete(oldId);
          oldNode && parent.removeChild(oldNode);

          // insert new node
          const item = items()[index];
          const id = item[key];
          const rf = f(item);
          const node = rf({ parent, document, childIndex: index });
          cache.set(id, node);
          currentIds[index] = id;
        } else if (op === "pop" || op === "shift") {
          items(); // effects might clean up in the future, this will keep the subscription

          const oldId = currentIds[op === "pop" ? -1 : 0];
          const oldNode = cache.get(oldId);
          oldNode && parent.removeChild(oldNode);
          cache.delete(oldId);
          currentIds[op]();
        } else if (op === "push" || op === "unshift") {
          const slice =
            op === "push"
              ? items().slice(-effectCtx.n)
              : items().slice(0, effectCtx.n);

          const ids = slice.map((item) => item[key]);
          const rfs = slice.map((item) => f(item));
          const nodes =
            op === "push"
              ? rfs.map((rf) => rf({ parent, document }))
              : rfs.map((rf, i) => rf({ parent, document, childIndex: i }));
          currentIds[op](...ids);
          for (let i = 0; i < ids.length; i++) cache.set(ids[i], nodes[i]);
        } else if (op === "sort" || op === "reverse") {
          currentIds = items().map((item) => item[key]);
          for (const id of currentIds) {
            const node = cache.get(id);
            node && parent.appendChild(node);
          }
        } else if (op === "set") {
          // remove cached nodes
          for (const node of cache.values()) {
            parent.removeChild(node);
          }

          currentIds = [];
          const nodes = items().map((item) => {
            const id = item[key];
            currentIds.push(id);

            const oldNode = cache.get(id);
            if (oldNode) {
              return parent.appendChild(oldNode);
            }

            const rf = f(item);
            return rf({ parent, document });
          });

          cache.clear();
          for (let i = 0; i < currentIds.length; i++)
            cache.set(currentIds[i], nodes[i]);
        }
      }
    }, true);

    return currentIds.map((id) => cache.get(id)!);
  };
}
