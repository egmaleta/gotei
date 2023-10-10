import { CONTEXT } from "./context";
import { Effect } from "./effect";
import { Signal as _Signal, ArraySignal } from "./signal";

export type SignalGetter<T> = () => T;
export type SignalSetter<T> = T extends Array<any>
  ? {
      set(value: T): void;
    }
  : {
      set(value: T): void;
      set(f: (old: T) => T): void;
    };
export type Signal<T> = SignalGetter<T> & SignalSetter<T>;

export function signal<T>(value: T): Signal<T> {
  // @ts-ignore
  const s = Array.isArray(value) ? new ArraySignal(value) : new _Signal(value);

  return Object.assign(s.get.bind(s), {
    set: s.set.bind(s),
  });
}

export function effect(callback: () => any) {
  new Effect(callback, false);
}

export function ref<T extends Node>() {
  return signal<T | null>(null);
}

export function isRefReady<T extends Node>(ref: Signal<T | null>) {
  return ref() !== null;
}

export const untrack = (CONTEXT as any).untrack.bind(CONTEXT) as <T>(
  signalish: () => T,
) => T;
