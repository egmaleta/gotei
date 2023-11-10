export type SignalGetter<T> = () => T;
export type SignalSetter<T> = {
  set: (x: T | ((v: T) => T)) => void;
};
export type Signal<T> = SignalGetter<T> & SignalSetter<T>;

let context: Effect[] = [];

class Effect {
  private callback: () => any;
  readonly prioritized: boolean;

  constructor(callback: () => any, prioritized: boolean) {
    this.callback = callback;
    this.prioritized = prioritized;

    this.run();
  }

  run() {
    context.push(this);
    this.callback();
    context.pop();
  }
}

class _Signal<T> {
  private value: T;
  private deps: Effect[] = [];

  constructor(value: T) {
    this.value = value;
  }

  subscribe(effect: Effect) {
    if (this.deps.indexOf(effect) === -1) {
      const method = effect.prioritized ? "unshift" : "push";
      this.deps[method](effect);
    }
  }
  runEffects() {
    for (const effect of this.deps) effect.run();
  }

  get() {
    if (context.length > 0) {
      const effect = context[context.length - 1];
      this.subscribe(effect);
    }

    return this.value;
  }
  set(x: T | ((v: T) => T)) {
    // @ts-ignore
    const value: T = typeof x === "function" ? x(this.value) : x;

    if (this.value !== value) {
      this.value = value;
      this.runEffects();
    }
  }
}

export function signal<T>(value: T): Signal<T> {
  const s = new _Signal(value);
  const getter = s.get.bind(s);
  const setter = s.set.bind(s);

  return Object.assign(getter, { set: setter });
}

export function effect(callback: () => any, prioritize = false) {
  new Effect(callback, prioritize);
}

export function ref<T extends Node>(): Signal<T | null> {
  return signal(null);
}

export function isRefReady<T extends Node>(
  ref: Signal<T | null>
): ref is Signal<T> {
  return ref() !== null;
}

export function untrack<T>(signalish: () => T) {
  const temp = context;
  context = [];
  const value = signalish();
  context = temp;

  return value;
}
