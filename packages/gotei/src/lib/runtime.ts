import type { Gotei } from "./runtime-ns";
import {
	EVENT_LISTENER_PREFIX,
	addEventListener,
	setAttribute,
	cls2Tokens,
	CSS_VAR_PREFIX,
	setCSSVar,
	setCSSProp,
	type OrComputed,
} from "./runtime-utils";
import { Effect } from "./state";
import { tagSymbol } from "./symbols";

export type HTMLVNodeChild =
	| Gotei.VNode
	| string
	| number
	| boolean
	| undefined
	| null;

export class HTMLVNode<T extends Gotei.Tag> implements Gotei.VNode<T> {
	[tagSymbol]: T;
	private props: Gotei.Props<T>;
	private children: HTMLVNodeChild[];

	constructor(tag: T, props: Gotei.Props<T>, children: HTMLVNodeChild[]) {
		this[tagSymbol] = tag;
		this.props = props;
		this.children = children;
	}

	mount(ctx: Gotei.RenderContext) {
		const el = document.createElement(this[tagSymbol]);

		const {
			bindThis,
			bindValue,
			use,
			classList,
			classRecord,
			styleRecord,
			...props
		} = this.props;

		for (const [name, prop] of Object.entries(props)) {
			if (name.startsWith(EVENT_LISTENER_PREFIX)) {
				addEventListener(el, name.slice(EVENT_LISTENER_PREFIX.length), prop);
			} else if (typeof prop !== "function") {
				setAttribute(el, name, prop);
			} else {
				new Effect(() => {
					setAttribute(el, name, prop());
				}, true);
			}
		}

		for (const child of this.children) {
			if (typeof child === "object" && child) {
				child.mount({ parent: el, childIndex: -1 });
			} else if (typeof child === "number" || typeof child === "string") {
				el.appendChild(document.createTextNode(`${child}`));
			}
		}

		if (bindValue) {
			const isNumber = typeof bindValue() === "number";

			new Effect(() => {
				setAttribute(el, "value", bindValue());
			}, true);
			addEventListener(el, "input", (ev: any) => {
				const value = ev.currentTarget.value;
				bindValue.set(isNumber ? Number.parseFloat(value) : value);
			});
		}

		bindThis?.set(el);

		if (use) {
			if (Array.isArray(use)) {
				for (const f of use) f(el as any);
			} else {
				use(el as any);
			}
		}

		if (classList) {
			for (const cls of classList) {
				if (typeof cls !== "function") {
					el.classList.add(...cls2Tokens(cls));
				} else {
					let tokens: string[] = [];

					new Effect(() => {
						el.classList.remove(...tokens);
						tokens = cls2Tokens(cls());
						el.classList.add(...tokens);
					}, true);
				}
			}
		}

		if (classRecord) {
			for (const [cls, ok] of Object.entries(classRecord)) {
				const tokens = cls2Tokens(cls);
				if (tokens.length === 0) continue;

				if (typeof ok !== "function") {
					ok && el.classList.add(...tokens);
				} else {
					new Effect(() => {
						if (ok()) {
							el.classList.add(...tokens);
						} else {
							el.classList.remove(...tokens);
						}
					}, true);
				}
			}
		}

		if (styleRecord) {
			for (const [prop, value] of Object.entries(styleRecord)) {
				const setFunction = prop.startsWith(CSS_VAR_PREFIX)
					? setCSSVar
					: setCSSProp;

				if (typeof value !== "function") {
					setFunction(el, prop, value);
				} else {
					new Effect(() => {
						setFunction(el, prop, value());
					}, true);
				}
			}
		}

		ctx.parent.appendChild(el);
	}
}

export class TextVNode<T extends string | number | boolean>
	implements Gotei.VNode<"text">
{
	[tagSymbol]: "text" = "text";
	private data: OrComputed<T>;

	constructor(data: OrComputed<T>) {
		this.data = data;
	}

	mount(ctx: Gotei.RenderContext) {
		const { data } = this;
		const text = document.createTextNode("");

		if (typeof data !== "function") {
			text.data = `${data}`;
		} else {
			new Effect(() => {
				text.data = `${data()}`;
			}, true);
		}

		ctx.parent.appendChild(text);
	}
}

export function h<T extends Gotei.Tag>(
	tag: T,
	props: Gotei.Props<T>,
	children: HTMLVNodeChild[],
) {
	return new HTMLVNode(tag, props, children);
}

export function text<T extends string | number | boolean>(data: OrComputed<T>) {
	return new TextVNode(data);
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

export function mount(to: ParentNode, ...vnodes: Gotei.VNode[]) {
	const ctx = { parent: to, childIndex: -1 };
	for (const vnode of vnodes) vnode.mount(ctx);
}
