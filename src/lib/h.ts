import type { Internal } from "./internal";

export function h<T extends Internal.Tag>(
	tag: T,
	props: Internal.Props<T>,
	children: Internal.Child<T>[],
): Internal.VNode<T> {
	return { tag, props, children };
}

type TagFunctions = {
	[T in keyof Internal.IntrinsicElements]: (
		props: Internal.Props<T>,
		...children: Internal.Child<T>[]
	) => Internal.VNode<T>;
} & {
	text: (...children: Internal.Child<"text">[]) => Internal.VNode<"text">;
};

export const tags = new Proxy(Object.prototype, {
	get(_, tag: any) {
		if (tag === "text") {
			return (...children: any) => h(tag, {}, children);
		}

		return (props: any, ...children: any[]) => h(tag, props, children);
	},
}) as TagFunctions;
