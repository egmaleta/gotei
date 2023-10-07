import { Effect } from "../state/effect";
import { OrComputed } from "./utils";

export type TextRenderizable = string | number | boolean;

export function text<T extends TextRenderizable>(data: OrComputed<T>) {
	const text = document.createTextNode("");

	if (typeof data !== "function") {
		text.data = `${data}`;
	} else {
		new Effect(() => {
			text.data = `${data()}`;
		}, true);
	}

	return text;
}
