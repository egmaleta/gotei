import { mount } from "gotei";
import { signal } from "gotei/state";
import counter from "./counter";

const shared = signal(0);
const increase = () => shared.set((v) => v + 1);

const counters = [...Array(10)].map((_) =>
	counter({
		count: shared,
		onclick: increase,
		styleRecord: { opacity: () => `${100 - 5 * shared()}%` },
	}),
);

const appDiv = document.querySelector("div#app");
appDiv && mount(appDiv, ...counters);
