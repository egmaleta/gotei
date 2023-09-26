import { render } from "gotei";
import type { Gotei } from "gotei/runtime";
import Counter from "./counter";

const counterButton = render(
	(
		<Counter initialCount={0} class="btn btn-primary" />
	) as Gotei.VNode<"button">,
);

document.querySelector("div#app")?.appendChild(counterButton);
