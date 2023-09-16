import { type Effect, topEffect } from "./effect";

export class Signal<T = any> {
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

	get val() {
		const effect = topEffect();
		effect && this.sub(effect);

		return this.value;
	}

	set val(value: T) {
		if (value !== this.value) {
			this.value = value;
			this.pub();
		}
	}

	peek() {
		return this.value;
	}

	map(func: (old: T) => T) {
		this.val = func(this.value);
	}
}
