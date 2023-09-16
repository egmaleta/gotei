const effectStack: Effect[] = [];

export function topEffect() {
	return effectStack.at(-1);
}

export class Effect {
	private callback: () => any;

	constructor(callback: () => any) {
		this.callback = callback;
		this.run();
	}

	run() {
		effectStack.push(this);
		this.callback();
		effectStack.pop();
	}
}
