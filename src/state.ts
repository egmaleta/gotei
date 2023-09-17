let EFFECT_STACK: Effect[] = [];

class Effect {
	private callback: () => any;

	constructor(callback: () => any) {
		this.callback = callback;
		this.run();
	}

	run() {
		EFFECT_STACK.push(this);
		this.callback();
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

export type SignalGetter<T> = () => T;
export type SignalSetter<T> = (value: T) => void;

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

export function peek<T>(signalish: SignalGetter<T>) {
	const temp = EFFECT_STACK;
	EFFECT_STACK = [];

	const value = signalish();
	EFFECT_STACK = temp;

	return value;
}
