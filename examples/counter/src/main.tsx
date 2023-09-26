import { replace } from "gotei";
import Counter from "./counter";
import { effect, signal } from "gotei/state";

const shared = signal(0);
effect(() => console.log(shared()));

const appDiv = document.querySelector("div#app");

const counters = (
	<div style="display: flex; flex-wrap: wrap;">
		{[...Array(1000)].map(() => (
			<Counter count={shared} />
		))}
	</div>
);

appDiv && replace(appDiv, counters);
