import { define, inherits } from "./oop";
import { CONTEXT } from "./context";

function ReadableSignal(value) {
	this.uiDeps = [];
	this.deps = [];
	this.value = value;
}

define(ReadableSignal, {
	subscribe(effect) {
		const deps = effect.isUIEffect ? this.uiDeps : this.deps;
		!deps.includes(effect) && deps.push(effect);
	},
	triggerUpdate(ctx) {
		for (const effect of this.uiDeps) effect.update(ctx);
		for (const effect of this.deps) effect.update(ctx);
	},
	get() {
		const effect = CONTEXT.current();
		effect && this.subscribe(effect);

		return this.value;
	},
});

export function Signal(value) {
	ReadableSignal.call(this, value);
}

inherits(Signal, ReadableSignal);

define(Signal, {
	set(value) {
		if (this.value !== value) {
			this.value = value;
			this.triggerUpdate(null);
		}
	},
});
