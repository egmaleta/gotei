export interface IEffect {
	run(): void;
}

export type SignalGetter<T> = () => T;
export type SignalSetter<T> = (value: T) => void;
