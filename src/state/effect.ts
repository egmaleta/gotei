import { pop, push } from "./effect-stack";
import type { IEffect } from "./types";

export class Effect implements IEffect {
	private callback: () => any;

	constructor(callback: () => any) {
		this.callback = callback;
		this.run();
	}

	run() {
		push(this);
		this.callback();
		pop();
	}
}
