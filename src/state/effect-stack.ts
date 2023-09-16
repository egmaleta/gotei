import type { IEffect, SignalGetter } from "./types";

let effectStack: IEffect[] = [];

export function read() {
	return effectStack.at(-1);
}

export function push(effect: IEffect) {
	effectStack.push(effect);
}

export function pop() {
	effectStack.pop();
}

export function peek<T>(signalish: SignalGetter<T>) {
	const temp = effectStack;
	effectStack = [];

	const value = signalish();
	effectStack = temp;

	return value;
}
