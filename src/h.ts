import type { Internal, OrComputed } from "./internal";

export function h<T extends Internal.Tag>(
	tag: T,
	props: Internal.Props<T>,
	children: Internal.VNodeChild[],
): Internal.TagVNode<T> {
	return { tag, props, children };
}

export function text(
	data: OrComputed<Internal.TextRenderizable>,
): Internal.TextVNode {
	return { tag: "text", children: data };
}

type TagFunctions = {
	[T in keyof Internal.IntrinsicElements]: (
		props: Internal.Props<T>,
		...children: Internal.VNodeChild[]
	) => Internal.TagVNode<T>;
};

export const tags = new Proxy(Object.prototype, {
	get(_, tag) {
		return function (props, ...children) {
			return h(tag as any, props, children);
		};
	},
}) as TagFunctions;
