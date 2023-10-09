import { Effect } from "../state/effect";
import { RenderFunction, OrComputed, mount } from "./utils";
import { Gotei } from "./ns";

export function show<T extends Node>(
	node: T,
	condition: OrComputed<boolean>,
): RenderFunction<T | null>;

export function show<T extends Gotei.Tag>(
	rf: RenderFunction<HTMLElementTagNameMap[T]>,
	condition: OrComputed<boolean>,
): RenderFunction<HTMLElementTagNameMap[T] | null>;

export function show(
	x: Node | RenderFunction,
	condition: OrComputed<boolean>,
): RenderFunction<Node | null> {
	return (ctx) => {
		const { parent, childIndex } = ctx;

		if (!parent) return null;

		if (typeof condition !== "function") {
			if (condition) {
				return typeof x === "function" ? x(ctx) : parent.appendChild(x);
			}
			return null;
		}

		let node: Node | null = null;

		new Effect(() => {
			if (condition()) {
				if (!node) {
					if (typeof x === "function") {
						node = x(ctx);
						return;
					}
					node = x;
				}
				node && mount(node, parent, childIndex);
			} else {
				node && parent.removeChild(node);
			}
		}, true);

		return node;
	};
}
