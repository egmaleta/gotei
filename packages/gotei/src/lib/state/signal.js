import { define, inherits } from "./oop";
import { CONTEXT } from "./context";

function Observable() {
	this.uiDeps = [];
	this.deps = [];
}

define(Observable, {
	subscribe(effect) {
		const deps = effect.isUIEffect ? this.uiDeps : this.deps;
		!deps.includes(effect) && deps.push(effect);
	},
	triggerUpdate(ctx) {
		for (const effect of this.uiDeps) effect.update(ctx);
		for (const effect of this.deps) effect.update(ctx);
	},
});

export function Signal(value) {
	Observable.call(this);
	this.value = value;
}

inherits(Signal, Observable);

define(Signal, {
	get() {
		const effect = CONTEXT.current();
		effect && this.subscribe(effect);

		return this.value;
	},
	set(value) {
		if (this.value !== value) {
			this.value = value;
			this.triggerUpdate(null);
		}
	},
});
