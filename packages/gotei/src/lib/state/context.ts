import { IObserver } from "./types";

class Context {
	private items: IObserver[] = [];

	push(item: IObserver) {
		this.items.push(item);
	}
	pop() {
		this.items.pop();
	}
	current() {
		return this.items.at(-1);
	}

	untrack<T>(signalish: () => T) {
		const temp = this.items;
		this.items = [];
		const value = signalish();
		this.items = temp;
		return value;
	}
}

export const CONTEXT = new Context();
