type Container<T> = { value: T };

export type SignalGetter<T> = () => T;
export type SignalSetter<T> = {
  (newValue: T): void;
  (mapF: (value: T) => T): void;
};
export type Signal<T> = readonly [SignalGetter<T>, SignalSetter<T>];

let currentCb: (() => any) | null = null;

export function effect(callback: () => any) {
  const temp = currentCb;
  currentCb = callback;
  callback();
  currentCb = temp;
}

export function untrack<T>(signalish: () => T) {
  const temp = currentCb;
  currentCb = null;
  const value = signalish();
  currentCb = temp;

  return value;
}

function getValue<T>(this: Container<T>, deps: Set<() => any>) {
  currentCb && deps.add(currentCb);
  return this.value;
}

function setValue<T>(
  this: Container<T>,
  deps: Set<() => any>,
  x: T | ((v: T) => T)
) {
  // @ts-ignore
  const value = typeof x !== "function" ? x : x(this.value);

  if (this.value !== value) {
    this.value = value;

    for (const cb of deps) {
      effect(cb);
    }
  }
}

export function signal<T>(init: () => T): Signal<T>;
export function signal<T>(value: T): Signal<T>;
export function signal<T>(x: unknown): Signal<T> {
  const ct = { value: typeof x !== "function" ? x : x() };
  const deps = new Set();

  // @ts-ignore
  return [getValue.bind(ct, deps), setValue.bind(ct, deps)];
}

export function ref<T extends Node>() {
  return signal<T | null>(null);
}
