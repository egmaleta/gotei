import { read } from "./effect-stack";
import type { IEffect } from "./types";

export class Signal<T = any> {
	private value: T;
	private deps: IEffect[];

	constructor(value: T) {
		this.value = value;
		this.deps = [];
	}

	private sub(effect: IEffect) {
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
		const effect = read();
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
