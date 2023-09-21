import { type Internal, TAG as TAG_SYMBOL } from "./internal";

type TagFunctions = {
	[T in keyof Internal.IntrinsicElements]: {
		(
			props: Internal.Props<T>,
			...children: Internal.Child<T>[]
		): Internal.VNode<T>;
		(...children: Internal.Child<T>[]): Internal.VNode<T>;
	};
} & {
	text: (...children: Internal.Child<"text">[]) => Internal.VNode<"text">;
};

export function h<T extends Internal.Tag>(
	tag: T,
	props: Internal.Props<T>,
	children: Internal.Child<T>[],
): Internal.VNode<T> {
	return { [TAG_SYMBOL]: tag, props, children };
}

export const TAGS = new Proxy(Object.prototype, {
	get(_, tag: any) {
		return (...args: any[]) => {
			if (tag !== "text" && args.length > 0) {
				const head = args[0];
				if (
					typeof head === "object" &&
					head !== null &&
					typeof head[TAG_SYMBOL] === "undefined"
				) {
					return h(tag, head, args.slice(1));
				}
			}

			return h(tag, {}, args);
		};
	},
}) as TagFunctions;
