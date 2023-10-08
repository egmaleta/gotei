import { Effect } from "../state/effect";
import { CONTEXT } from "./context";
import { OrComputed } from "./utils";

type TextRenderizable = string | number | boolean;

export function text<T extends TextRenderizable>(data: OrComputed<T>) {
	const text = CONTEXT.window().document.createTextNode("");

	if (typeof data !== "function") {
		text.data = `${data}`;
	} else {
		new Effect(() => {
			text.data = `${data()}`;
		}, true);
	}

	return text;
}
