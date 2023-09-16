import { Effect } from "./effect";
import { Signal } from "./signal";
import type { SignalGetter, SignalSetter } from "./types";

export type { SignalGetter, SignalSetter };

export { peek } from "./effect-stack";

export function signal<T>(
	value: T,
): readonly [SignalGetter<T>, SignalSetter<T>] {
	const s = new Signal(value);

	return [s.get.bind(s), s.set.bind(s)] as const;
}

export function effect(callback: () => any) {
	new Effect(callback);
}

export function derived<T>(computation: () => T): SignalGetter<T> {
	const s = new Signal(null);

	new Effect(() => {
		s.set(computation());
	});

	return s.get.bind(s);
}
