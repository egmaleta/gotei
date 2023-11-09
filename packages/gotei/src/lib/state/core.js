function inherits(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
}

function define(Class, methods) {
  Object.assign(Class.prototype, methods);
}

const CONTEXT = {
  stack: [],
  push(obs) {
    this.stack.push(obs);
  },
  pop() {
    this.stack.pop();
  },
  current() {
    return this.stack[this.stack.length - 1];
  },
  untrack(signalish) {
    const temp = this.stack;
    this.stack = [];
    const value = signalish();
    this.stack = temp;
    return value;
  },
};

export function Effect(callback, isUIEffect) {
  this.callback = callback;
  this.isUIEffect = isUIEffect;
  this.update();
}

define(Effect, {
  update() {
    CONTEXT.push(this);
    this.callback();
    CONTEXT.pop();
  },
});

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
  triggerUpdate() {
    for (const effect of this.uiDeps) effect.update();
    for (const effect of this.deps) effect.update();
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
      this.triggerUpdate();
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
            triggerUpdate();
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
            typeof item !== "undefined" && triggerUpdate();
            return item;
          };
        } else if (prop === "push" || prop === "unshift") {
          return (...items) => {
            const l = target[prop](...items);
            items.length > 0 && triggerUpdate();
            return l;
          };
        } else if (prop === "sort" || prop === "reverse") {
          return (...args) => {
            const array = target[prop](...args);
            array.length > 1 && triggerUpdate();
            return array;
          };
        } else if (prop === "splice") {
          return (...args) => {
            const l = target.length;
            const deleted = target[prop](...args);
            (deleted.length > 0 || l !== target.length) && triggerUpdate();
            return deleted;
          };
        } else {
          return target[prop];
        }
      },
    });

    this.value = proxied;
  },
  set(value) {
    this.wrap(value);
    this.triggerUpdate();
  },
});

export const untrack = CONTEXT.untrack.bind(CONTEXT);
