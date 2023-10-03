import { CONTEXT } from "./context";
import { Effect } from "./effect";
import { Signal as SignalClass } from "./signal";

export type SignalGetter<T> = () => T;
export type SignalSetter<T> = {
	set(value: T): void;
	map(func: (old: T) => T): void;
};
export type Signal<T> = SignalGetter<T> & SignalSetter<T>;

export function signal<T>(value: T): Signal<T> {
	const s = new SignalClass(value);

	return Object.assign(s.get.bind(s), {
		set: s.set.bind(s),
		map: (func: (old: T) => T) => s.set(func(s.get())),
	});
}

export function effect(callback: () => any) {
	new Effect(callback, false);
}

export function element<T extends HTMLElement>() {
	return signal<T | null>(null);
}

export function isNotNull<T>(signal: Signal<T | null>): signal is Signal<T> {
	return signal() !== null;
}

export const untrack = CONTEXT.untrack.bind(CONTEXT);
