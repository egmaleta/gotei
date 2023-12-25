import { Gotei } from "./ns";
import { effect } from "./state";

class ListVNode<
  T extends Record<string, any>,
  N extends Node,
  K extends keyof T,
> implements Gotei.VNode<(N | Comment)[]>
{
  constructor(
    private f: (obj: T) => Gotei.VNode<N>,
    private key: K,
    private list: () => T[]
  ) {}

  render() {
    const cache = new Map<T[K], N>();
    const limit = document.createComment("gotei reactive list end position");

    effect(() => {
      const pairs = this.list().map((item) => {
        const k = item[this.key];

        if (cache.has(k)) return [k, cache.get(k)!] as const;

        return [k, this.f(item).render()] as const;
      });

      if (limit.parentNode) {
        const parent = limit.parentNode;
        for (const node of cache.values()) parent.removeChild(node);
        for (const [_, node] of pairs) parent.insertBefore(node, limit);
      }

      cache.clear();
      for (const [k, node] of pairs) cache.set(k, node);
    });

    return [...cache.values(), limit];
  }
}

export function map<
  T extends Record<string, any>,
  K extends keyof T,
  N extends Node,
>(f: (obj: T) => Gotei.VNode<N>, over: () => T[], cacheKey: K) {
  return new ListVNode(f, cacheKey, over);
}
