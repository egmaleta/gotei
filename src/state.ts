type Action<C = any> = (ctx?: C) => any;

let currentAction: Action | null = null;

function effect<C>(action: Action<C>, ctx?: C) {
  const temp = currentAction;
  currentAction = action;
  action(ctx);
  currentAction = temp;
}

function runEffects<C>(actions: Iterable<Action<C>>, ctx?: C) {
  for (const action of actions) {
    effect(action, ctx);
  }
}

type TrackedArrayOp =
  | "push"
  | "unshift"
  | "pop"
  | "shift"
  | "reverse"
  | { start: number; deleteCount: number; insertCount: number };

const $IS_TRAP = Symbol();

function trap<T>(array: T[], actions: Iterable<Action<TrackedArrayOp>>) {
  // @ts-ignore
  const arr = array[$IS_TRAP] ? [...array] : array;

  const proxy = new Proxy(arr, {
    get(target, method: string) {
      if (method === "push" || method === "unshift") {
        return (...items: T[]) => {
          const l = target.length;
          const nl = target[method](...items);
          nl !== l && runEffects(actions, method);
          return nl;
        };
      }
      if (method === "pop" || method === "shift") {
        return () => {
          const l = target.length;
          const item = target[method]();
          target.length !== l && runEffects(actions, method);
          return item;
        };
      }
      if (method === "splice") {
        return (start: number, deleteCount?: number, ...items: T[]) => {
          const dc = deleteCount ?? 0;
          const deleted = target.splice(start, dc, ...items);
          if (deleted.length > 0 || items.length > 0) {
            runEffects(actions, {
              start,
              deleteCount: dc,
              insertCount: items.length,
            });
          }

          return deleted;
        };
      }
      if (method === "reverse") {
        return () => {
          const reversed = target.reverse();
          reversed.length > 1 && runEffects(actions, method);
          return reversed;
        };
      }
      if (method === "sort") {
        return (compareFn?: (a: T, b: T) => number) => {
          const old = [...target];
          const sorted = target.sort(compareFn);
          for (let i = 0; i < sorted.length; i++) {
            if (old[i] !== sorted[i]) {
              runEffects(actions);
              break;
            }
          }
          return sorted;
        };
      }

      // @ts-ignore
      return target[method];
    },
  });

  // @ts-ignore
  proxy[$IS_TRAP] = true;

  return proxy;
}

interface ReadableSignal<T> {
  get v(): T;
  get uv(): T;
}

interface WritableSignal<T> {
  set v(value: T);
}

class Signal<T> implements ReadableSignal<T>, WritableSignal<T> {
  private value: T;
  private actions = new Set<Action>();

  constructor(value: T) {
    this.value = Array.isArray(value)
      ? (trap(value, this.actions) as T)
      : value;
  }

  get v() {
    currentAction && this.actions.add(currentAction);
    return this.value;
  }

  get uv() {
    return this.value;
  }

  set v(value: T) {
    if (value !== this.value) {
      this.value = Array.isArray(value)
        ? (trap(value, this.actions) as T)
        : value;
      runEffects(this.actions);
    }
  }
}

function signal<T>(value: T) {
  return new Signal(value);
}

function untrap<T>(f: () => T): T {
  const v = f();
  // @ts-ignore
  if (Array.isArray(v) && v[$IS_TRAP]) {
    return [...v] as T;
  }
  return v;
}

function untrack<T>(f: () => T) {
  const temp = currentAction;
  currentAction = null;
  const value = f();
  currentAction = temp;
  return value;
}

class DerivedSignal<T> implements ReadableSignal<T> {
  private f: () => T;

  constructor(f: () => T) {
    this.f = untrap.bind(null, f) as typeof f;
  }

  get v() {
    return this.f();
  }

  get uv() {
    return untrack(this.f);
  }
}

function derived<T>(computation: () => T) {
  return new DerivedSignal(computation);
}

export type { TrackedArrayOp };
export { effect, signal, derived };
