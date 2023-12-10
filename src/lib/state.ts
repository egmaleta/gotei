type Container<T> = {
  value: T;
};

export type SignalGetter<T> = () => T;
export type SignalSetter<T> = {
  (newValue: T): void;
  (mapFunction: (value: T) => T): void;
};
export type Signal<T> = readonly [SignalGetter<T>, SignalSetter<T>];

let stack: (() => any)[] = [];

function run(cb: () => any) {
  stack.push(cb);
  cb();
  stack.pop();
}

function getValue<T>(this: Container<T>, deps: Set<() => any>) {
  if (stack.length > 0) {
    const cb = stack[stack.length - 1];
    deps.add(cb);
  }

  return this.value;
}

function setValue<T>(
  this: Container<T>,
  deps: Set<() => any>,
  x: T | ((v: T) => T)
) {
  // @ts-ignore
  const value: T = typeof x === "function" ? x(this.value) : x;

  if (this.value !== value) {
    this.value = value;

    for (const cb of deps) {
      run(cb);
    }
  }
}

function signal<T>(init: () => T): Signal<T>;
function signal<T>(value: T): Signal<T>;
function signal<T>(x: T | (() => T)): Signal<T> {
  // @ts-ignore
  const ct = { value: typeof x !== "function" ? x : x() };
  const deps = new Set();

  // @ts-ignore
  return [getValue.bind(ct, deps), setValue(ct, deps)];
}

function ref<T extends Node>() {
  return signal<T | null>(null);
}

function untrack<T>(signalish: () => T) {
  const temp = stack;
  stack = [];
  const value = signalish();
  stack = temp;

  return value;
}

export { run as effect, signal, ref, untrack };
