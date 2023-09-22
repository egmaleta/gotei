import type {
	Callback,
	Computation,
	SignalGetter,
	SignalSetter,
} from "./types";

export type { SignalGetter, SignalSetter };

let EFFECT_STACK: Effect[] = [];

function untrack<T>(signalish: SignalGetter<T>) {
	const temp = EFFECT_STACK;
	EFFECT_STACK = [];

	const value = signalish();
	EFFECT_STACK = temp;

	return value;
}

class Effect {
	private callback: Callback;

	constructor(callback: Callback) {
		this.callback = callback;
		this.run();
	}

	run() {
		EFFECT_STACK.push(this);
		this.callback(untrack);
		EFFECT_STACK.pop();
	}
}

class Signal<T = any> {
	private value: T;
	private deps: Effect[];

	constructor(value: T) {
		this.value = value;
		this.deps = [];
	}

	private sub(effect: Effect) {
		if (!this.deps.includes(effect)) {
			this.deps.push(effect);
		}
	}

	private pub() {
		for (const effect of this.deps) {
			effect.run();
		}
	}

	get() {
		const effect = EFFECT_STACK.at(-1);
		effect && this.sub(effect);

		return this.value;
	}

	set(value: T) {
		if (value !== this.value) {
			this.value = value;
			this.pub();
		}
	}
}

export function signal<T>(value: T): SignalGetter<T> & SignalSetter<T> {
	const s = new Signal(value);

	return Object.assign(s.get.bind(s), {
		set: s.set.bind(s),
		map: (func: (old: T) => T) => s.set(func(s.get())),
	});
}

export function effect(callback: Callback) {
	new Effect(callback);
}

export function computed<T>(computation: Computation<T>): SignalGetter<T> {
	const s = new Signal<any>(null);

	new Effect((untrack) => {
		s.set(computation(untrack));
	});

	return s.get.bind(s);
}
