import type { Gotei, OrComputed, TagFunctions } from "./runtime-types";
import { tagSymbol } from "./symbols";

export function h<T extends Gotei.Tag>(
	tag: T,
	props: Gotei.Props<T>,
	children: Gotei.HtmlVNodeChild[],
): Gotei.HtmlVNode<T> {
	return { [tagSymbol]: tag, props, children };
}

export function text(
	data: OrComputed<string | number | boolean>,
): Gotei.TextVNode {
	return { [tagSymbol]: "text", data };
}

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
					return h(tag, head, args.slice(1));
				}
			}

			return h(tag, {}, args);
		};
	},
}) as TagFunctions;
