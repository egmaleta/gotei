import { append } from "gotei";
import { signal } from "gotei/state";
import counter from "./counter";

const shared = signal(0);
const increase = () => shared.map((v) => v + 1);

const counters = [...Array(10)].map((_) =>
	counter({ count: shared, onclick: increase }),
);

const appDiv = document.querySelector("div#app");
appDiv && append(appDiv, ...counters);
