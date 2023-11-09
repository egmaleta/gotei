import {
  Signal as _Signal,
  Effect,
  ArraySignal,
  untrack as _untrack,
} from "./core";

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

export function ref<T extends Node>(): Signal<T | null> {
  return signal<T>(null);
}

export function isRefReady<T extends Node>(
  ref: Signal<T | null>
): ref is Signal<T> {
  return ref() !== null;
}

export const untrack = _untrack as <T>(signalish: () => T) => T;
