import { define } from "../oop";
import { Effect } from "../state/effect";
import { typeSymbol } from "../symbols";

export function TextVNode(data) {
	this[typeSymbol] = "text";
	this.data = data;
}

define(TextVNode, {
	mount(ctx) {
		const { data } = this;
		const text = document.createTextNode("");

		if (typeof data !== "function") {
			text.data = `${data}`;
		} else {
			new Effect(() => {
				text.data = `${data()}`;
			}, true);
		}

		ctx.parent.appendChild(text);
	},
});

export function text(data) {
	return new TextVNode(data);
}

export function isTextVNode(vnode) {
	vnode[typeSymbol] === "text";
}
