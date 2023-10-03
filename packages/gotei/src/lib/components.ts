import {
	ConditionalVNode,
	HTMLVNode,
	HTMLVNodeChild,
	TextVNode,
} from "./runtime";
import { Gotei } from "./runtime";
import { OrArray, OrComputed, flatten } from "./runtime/utils";
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
		(
			props: Gotei.Props<T>,
			...children: OrArray<HTMLVNodeChild>[]
		): HTMLVNode<T>;
		(...children: OrArray<HTMLVNodeChild>[]): HTMLVNode<T>;
	};
};

export const tags = new Proxy(Object.prototype, {
	get(_, tag: any) {
		return (...args: any[]) => {
			if (args.length > 0) {
				const head = args[0];
				if (
					typeof head === "object" &&
					!Array.isArray(head) &&
					head !== null &&
					typeof head[tagSymbol] === "undefined"
				) {
					return new HTMLVNode(tag, head, [...flatten(args.slice(1))]);
				}
			}

			return new HTMLVNode(tag, {}, [...flatten(args)]);
		};
	},
}) as Tags;
