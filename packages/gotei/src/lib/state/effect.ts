import { CONTEXT } from "./context";
import { IObserver, Priority } from "./types";

export class Effect implements IObserver {
	private callback: () => any;
	readonly isUIEffect: boolean;

	constructor(callback: () => any, isUIEffect: boolean) {
		this.callback = callback;
		this.isUIEffect = isUIEffect;
		this.update();
	}

	update() {
		CONTEXT.push(this);
		this.callback();
		CONTEXT.pop();
	}

	priority() {
		return this.isUIEffect ? Priority.High : Priority.Low;
	}
}
