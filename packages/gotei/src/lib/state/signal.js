import { define, inherits } from "./oop";
import { CONTEXT } from "./context";

function ReadableSignal(value) {
  this.uiDeps = [];
  this.deps = [];
  this.value = value;
}

define(ReadableSignal, {
  subscribe(effect) {
    const deps = effect.isUIEffect ? this.uiDeps : this.deps;
    !deps.includes(effect) && deps.push(effect);
  },
  triggerUpdate(ctx) {
    for (const effect of this.uiDeps) effect.update(ctx);
    for (const effect of this.deps) effect.update(ctx);
  },
  get() {
    const effect = CONTEXT.current();
    effect && this.subscribe(effect);

    return this.value;
  },
});

export function Signal(value) {
  ReadableSignal.call(this, value);
}

inherits(Signal, ReadableSignal);
define(Signal, {
  set(value) {
    const v = typeof value === "function" ? value(this.value) : value;

    if (this.value !== v) {
      this.value = v;
      this.triggerUpdate(null);
    }
  },
});

export function ArraySignal(value) {
  ReadableSignal.call(this, value);
  this.wrap(value);
}

inherits(ArraySignal, ReadableSignal);
define(ArraySignal, {
  wrap(value) {
    const triggerUpdate = this.triggerUpdate.bind(this);
    const proxied = new Proxy(value, {
      set(target, prop, value) {
        const index = +prop;
        if (!isNaN(index)) {
          const current = target[index];
          if (current !== value) {
            target[index] = value;
            triggerUpdate({ op: "setat", index });
          }
        } else {
          target[prop] = value;
        }

        return true;
      },
      get(target, prop) {
        if (prop === "pop" || prop === "shift") {
          return () => {
            const item = target[prop]();
            typeof item !== "undefined" && triggerUpdate({ op: prop });
            return item;
          };
        } else if (prop === "push" || prop === "unshift") {
          return (...items) => {
            const l = target[prop](...items);
            items.length > 0 && triggerUpdate({ op: prop, n: items.length });
            return l;
          };
        } else if (prop === "sort" || prop === "reverse") {
          return (...args) => {
            const array = target[prop](...args);
            array.length > 1 && triggerUpdate({ op: prop });
            return array;
          };
        } else {
          // TODO: handle "splice" prop
          return target[prop];
        }
      },
    });

    this.value = proxied;
  },
  set(value) {
    this.wrap(value);
    this.triggerUpdate({ op: "set" });
  },
});
