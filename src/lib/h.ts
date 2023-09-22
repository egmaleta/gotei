import { tagSymbol } from "./symbols";
import type { Gotei, TagFunctions } from "./types";

export function h<T extends Gotei.Tag>(
	tag: T,
	props: Gotei.Props<T>,
	children: Gotei.Child<T>[],
): Gotei.VNode<T> {
	return { [tagSymbol]: tag, props, children };
}

export const tags = new Proxy(Object.prototype, {
	get(_, tag: any) {
		return (...args: any[]) => {
			if (tag !== "text" && args.length > 0) {
				const head = args[0];
				if (
					typeof head === "object" &&
					head !== null &&
					typeof head[tagSymbol] === "undefined"
				) {
					return h(tag, head, args.slice(1));
				}
			}

			return h(tag, {}, args);
		};
	},
}) as TagFunctions;
