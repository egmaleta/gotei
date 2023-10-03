export enum Priority {
	Low = 0,
	High = 1,
}

export interface IObserver {
	update(): void;
	priority(): Priority;
}

export interface IObservable {
	subscribe(obs: IObserver): void;
	triggerUpdate(): void;
}
