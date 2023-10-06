import { CONTEXT } from "./context";
import { Effect } from "./effect";
import { Signal, ArraySignal } from "./signal";

export function signal(value) {
	const s = Array.isArray(value) ? new ArraySignal(value) : new Signal(value);

	return Object.assign(s.get.bind(s), {
		set: s.set.bind(s),
	});
}

export function effect(callback) {
	new Effect(callback, false);
}

export function ref() {
	return signal(null);
}

export function isRefReady(ref) {
	return ref() !== null;
}

export const untrack = CONTEXT.untrack.bind(CONTEXT);
