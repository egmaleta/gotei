import { Effect } from "./effect";
import { Signal } from "./signal";

export type { Signal };

export type ReadonlySignal<T = any> = {
	readonly val: T;
	peek(): T;
};

export function signal<T = any>(value: T): Signal<T> {
	return new Signal(value);
}

export function effect(callback: () => any) {
	new Effect(callback);
}

export function derived<T = any>(computation: () => T): ReadonlySignal<T> {
	const s = new Signal(null);

	new Effect(() => {
		s.val = computation();
	});

	return Object.create(Object.prototype, {
		val: { get: () => s.val },
		peek: { value: () => s.peek() },
	});
}
