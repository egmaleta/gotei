import { Gotei, OrArray, OrComputed } from "./ns";
import { typeSymbol } from "./symbols";

type Tags = {
	[T in Gotei.Tag]: {
		(
			props: Gotei.Props<T>,
			...children: OrArray<Gotei.HTMLVNodeChild>[]
		): Gotei.HTMLVNode<T>;
		(...children: OrArray<Gotei.HTMLVNodeChild>[]): Gotei.HTMLVNode<T>;
	};
};

function* flatten<T>(maybeArray: OrArray<T>): Generator<T> {
	if (Array.isArray(maybeArray)) {
		for (const maybeArrayItem of maybeArray) {
			for (const item of flatten(maybeArrayItem)) {
				yield item;
			}
		}
	} else {
		yield maybeArray;
	}
}

export function h<T extends Gotei.Tag>(
	tag: T,
	props: Gotei.Props<T>,
	children: Gotei.HTMLVNodeChild[],
): Gotei.HTMLVNode {
	return { [typeSymbol]: "html", tag, props, children };
}

export const tags = new Proxy(Object.prototype, {
	get(_, tag: any) {
		return (...args: any[]) => {
			if (args.length > 0) {
				const head = args[0];
				if (
					typeof head === "object" &&
					!Array.isArray(head) &&
					head !== null &&
					typeof head[typeSymbol] === "undefined"
				) {
					return h(tag, head, [...flatten(args.slice(1))]);
				}
			}
			return h(tag, {}, [...flatten(args)]);
		};
	},
}) as Tags;

export function text<T extends Gotei.TextRenderizable>(
	data: OrComputed<T>,
): Gotei.TextVNode {
	return { [typeSymbol]: "text", data };
}

export function show<T extends Gotei.VNode>(
	vnode: T,
	condition: OrComputed<boolean>,
): Gotei.ConditionalVNode {
	return { [typeSymbol]: "maybe", vnode, condition };
}

export function ternary<T extends Gotei.VNode, Q extends Gotei.VNode>(
	yes: T,
	no: Q,
	condition: OrComputed<boolean>,
) {
	return [
		show(yes, condition),
		show(no, typeof condition === "function" ? () => !condition() : !condition),
	];
}
