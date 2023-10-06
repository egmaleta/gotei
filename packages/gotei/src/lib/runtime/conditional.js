import { define } from "../oop";
import { Effect } from "../state/effect";
import { typeSymbol } from "../symbols";
import { renderOrphanNode } from "./utils";

export function ConditionalVNode(vnode, condition) {
	this[typeSymbol] = "maybe";
	this.vnode = vnode;
	this.condition = condition;
}

define(ConditionalVNode, {
	mount(ctx) {
		const { condition, vnode } = this;

		if (typeof condition !== "function") {
			condition && vnode.mount(ctx);
			return;
		}

		const { parent, childIndex: index } = ctx;
		let node = null;

		new Effect(() => {
			if (condition()) {
				if (!node) {
					node = renderOrphanNode(vnode);
				}
				if (index >= parent.childNodes.length) {
					parent.appendChild(node);
				} else {
					parent.insertBefore(node, parent.childNodes.item(index));
				}
			} else {
				node && parent.removeChild(node);
			}
		}, true);
	},
});

export function show(vnode, condition) {
	return new ConditionalVNode(vnode, condition);
}

export function ternary(yes, no, condition) {
	return [
		show(yes, condition),
		show(no, typeof condition === "function" ? () => !condition() : !condition),
	];
}
