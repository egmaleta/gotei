import {
	ConditionalVNode,
	HTMLVNode,
	HTMLVNodeChild,
	TextVNode,
} from "./runtime";
import type { Gotei } from "./runtime-ns";
import { type OrComputed } from "./runtime-utils";
import { tagSymbol } from "./symbols";

export function text<T extends string | number | boolean>(data: OrComputed<T>) {
	return new TextVNode(data);
}

export function show<T extends Gotei.VNode>(
	vnode: T,
	condition: OrComputed<boolean | undefined | null>,
) {
	return new ConditionalVNode(vnode, condition);
}

type Tags = {
	[T in Gotei.Tag]: {
		(props: Gotei.Props<T>, ...children: HTMLVNodeChild[]): HTMLVNode<T>;
		(...children: HTMLVNodeChild[]): HTMLVNode<T>;
	};
};

export const tags = new Proxy(Object.prototype, {
	get(_, tag: any) {
		return (...args: any[]) => {
			if (args.length > 0) {
				const head = args[0];
				if (
					typeof head === "object" &&
					head !== null &&
					typeof head[tagSymbol] === "undefined"
				) {
					return new HTMLVNode(tag, head, args.slice(1));
				}
			}

			return new HTMLVNode(tag, {}, args);
		};
	},
}) as Tags;
