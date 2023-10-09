import { Effect } from "../state/effect";
import { OrComputed, RenderFunction } from "./utils";

type TextRenderizable = string | number | boolean;

export function text<T extends TextRenderizable>(
	data: OrComputed<T>,
): RenderFunction<Text> {
	return (ctx) => {
		const text = ctx.document.createTextNode("");

		if (typeof data !== "function") {
			text.data = `${data}`;
		} else {
			new Effect(() => {
				text.data = `${data()}`;
			}, true);
		}

		ctx.parent?.appendChild(text);

		return text;
	};
}
