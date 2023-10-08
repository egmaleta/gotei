import { mount, tags } from "gotei";
import { signal } from "gotei/state";

import counter from "./counter";

const shared = signal(0);
const increase = () => shared.set((v) => v + 1);
const opacity = () => `${100 - 5 * shared()}%`;

const counters = tags.div(
	[...Array(10)].map((_) =>
		counter({
			count: shared,
			onclick: increase,
			styleRecord: { opacity },
		}),
	),
);

const appDiv = document.querySelector("div#app");
appDiv && mount(counters, appDiv);
