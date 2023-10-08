import { Effect } from "../state/effect";
import { MountFunction, OrComputed, mount } from "./utils";
import { Gotei } from "./ns";

export function show<T extends Node>(
	node: T,
	condition: OrComputed<boolean>,
): MountFunction<T | null>;

export function show<T extends Gotei.Tag>(
	mf: MountFunction<HTMLElementTagNameMap[T]>,
	condition: OrComputed<boolean>,
): MountFunction<HTMLElementTagNameMap[T] | null>;

export function show(x: Node | MountFunction, condition: OrComputed<boolean>) {
	return (parent: ParentNode, index: number) => {
		if (typeof condition !== "function") {
			if (condition) {
				return typeof x === "function"
					? x(parent, index)
					: parent.appendChild(x);
			}
			return null;
		}

		let node: Node | null = null;

		new Effect(() => {
			if (condition()) {
				if (!node) {
					if (typeof x === "function") {
						node = x(parent, index);
						return;
					}
					node = x;
				}
				node && mount(node, parent, index);
			} else {
				node && parent.removeChild(node);
			}
		}, true);

		return node;
	};
}
