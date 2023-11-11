const $prioritized = Symbol();

type Callback = {
  (): any;
  [$prioritized]: boolean;
};

let stack: Callback[] = [];

function run(cb: Callback) {
  stack.push(cb);
  cb();
  stack.pop();
}

export function effect(callback: () => any, prioritize = false) {
  const cb = Object.assign(callback, { [$prioritized]: prioritize });
  run(cb);
}

type Container<T> = {
  value: T;
};

function get<T>(this: Container<T>, deps: Callback[]) {
  if (stack.length > 0) {
    const cb = stack[stack.length - 1];
    !cb[$prioritized] ? deps.push(cb) : deps.unshift(cb);
  }

  return this.value;
}

function set<T>(this: Container<T>, deps: Callback[], x: T | ((v: T) => T)) {
  // @ts-ignore
  const value: T = typeof x === "function" ? x(this.value) : x;

  if (this.value !== value) {
    this.value = value;

    for (const cb of deps) {
      run(cb);
    }
  }
}

export type SignalSetter<T> = { set: (x: T | ((v: T) => T)) => void };
export type Signal<T> = (() => T) & SignalSetter<T>;

export function signal<T>(value: T): Signal<T> {
  const ct = { value };
  const deps = [];

  // @ts-ignore
  return Object.assign(get.bind(ct, deps), {
    set: set.bind(ct, deps),
  });
}

export function ref<T extends Node>() {
  return signal<T | null>(null);
}

export function untrack<T>(signalish: () => T) {
  const temp = stack;
  stack = [];
  const value = signalish();
  stack = temp;

  return value;
}
