import { CONTEXT } from "./context";
import { IObservable, IObserver, Priority } from "./types";

class Observable implements IObservable {
	private uiDeps: IObserver[] = [];
	private deps: IObserver[] = [];

	subscribe(obs: IObserver) {
		const deps = obs.priority() === Priority.High ? this.uiDeps : this.deps;
		!deps.includes(obs) && deps.push(obs);
	}
	triggerUpdate() {
		for (const obs of this.uiDeps) obs.update();
		for (const obs of this.deps) obs.update();
	}
}

export class Signal<T> extends Observable {
	private value: T;

	constructor(value: T) {
		super();
		this.value = value;
	}

	get() {
		const obs = CONTEXT.current();
		obs && this.subscribe(obs);

		return this.value;
	}
	set(value: T) {
		if (this.value !== value) {
			this.value = value;
			this.triggerUpdate();
		}
	}
}
