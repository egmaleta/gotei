let EFFECT_STACK: Effect[] = [];

function untrack<T>(signalish: SignalGetter<T>) {
	const temp = EFFECT_STACK;
	EFFECT_STACK = [];

	const value = signalish();
	EFFECT_STACK = temp;

	return value;
}

type UntrackFunction = typeof untrack;
type Computation<T> = (untrack: UntrackFunction) => T;
type EffectCallback = Computation<any>;

class Effect {
	private callback: EffectCallback;

	constructor(callback: EffectCallback) {
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

export type SignalGetter<T> = () => T;
export type SignalSetter<T> = {
	(value: T): void;
	(map: (old: T) => T): void;
};

export function signal<T>(
	value: T,
): readonly [SignalGetter<T>, SignalSetter<T>] {
	const s = new Signal(value);

	const setter = (v: T | ((old: T) => T)) => {
		if (v instanceof Function) {
			s.set(v(s.get()));
		} else {
			s.set(v);
		}
	};

	return [s.get.bind(s), setter] as const;
}

export function effect(callback: EffectCallback) {
	new Effect(callback);
}

export function derived<T>(computation: Computation<T>): SignalGetter<T> {
	const s = new Signal<any>(null);

	new Effect(() => {
		s.set(computation(untrack));
	});

	return s.get.bind(s);
}
