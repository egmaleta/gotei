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

export class Effect {
	private callback: Callback;
	readonly isUIEffect: boolean;

	constructor(callback: Callback, isUIEffect: boolean) {
		this.callback = callback;
		this.isUIEffect = isUIEffect;
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
	private uiDeps: Effect[] = [];
	private deps: Effect[] = [];

	constructor(value: T) {
		this.value = value;
	}

	private sub(effect: Effect) {
		const deps = effect.isUIEffect ? this.uiDeps : this.deps;
		!deps.includes(effect) && deps.push(effect);
	}

	private pub() {
		for (const effect of this.uiDeps) {
			effect.run();
		}
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
	new Effect(callback, false);
}

export function computed<T>(computation: Computation<T>): SignalGetter<T> {
	const s = new Signal<any>(null);

	new Effect((untrack) => {
		s.set(computation(untrack));
	}, false);

	return s.get.bind(s);
}