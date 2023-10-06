export type SignalGetter<T> = () => T;
export type SignalSetter<T> = T extends Array<any>
	? {
			set(value: T): void;
	  }
	: {
			set(value: T): void;
			set(f: (old: T) => T): void;
	  };
export type Signal<T> = SignalGetter<T> & SignalSetter<T>;

export declare function signal<T>(value: T): Signal<T>;

export declare function effect(callback: () => any): void;

export declare function ref<T extends Node>(): Signal<T | null>;

export declare function isRefReady<T extends Node>(
	ref: Signal<T | null>,
): ref is Signal<T>;

export declare function untrack<T>(signalish: () => T): T;
