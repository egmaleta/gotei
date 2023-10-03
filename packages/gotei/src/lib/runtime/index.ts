import { Gotei } from "./ns";
import {
	EVENT_LISTENER_PREFIX,
	addEventListener,
	setAttribute,
	cls2Tokens,
	CSS_VAR_PREFIX,
	setCSSVar,
	setCSSProp,
	OrComputed,
} from "./utils";
import { Effect } from "../state/effect";
import { tagSymbol } from "../symbols";

export type { Gotei };

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

		const thisCtx = { parent: el, childIndex: 0 };
		for (const child of this.children) {
			if (
				typeof child === "boolean" ||
				typeof child === "undefined" ||
				!child
			) {
				continue;
			}

			if (typeof child === "object") {
				child.mount(thisCtx);
			} else {
				el.appendChild(document.createTextNode(`${child}`));
			}

			thisCtx.childIndex++;
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

export class ConditionalVNode<T extends Gotei.VNode>
	implements Gotei.VNode<"maybe">
{
	[tagSymbol]: "maybe" = "maybe";
	private vnode: T;
	private condition: OrComputed<boolean | undefined | null>;

	constructor(vnode: T, condition: OrComputed<boolean | undefined | null>) {
		this.vnode = vnode;
		this.condition = condition;
	}

	private renderNode() {
		const fragment = document.createDocumentFragment();
		this.vnode.mount({ parent: fragment, childIndex: -1 });

		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		const node = fragment.lastChild!;
		node.remove();
		return node;
	}

	mount(ctx: Gotei.RenderContext) {
		const { condition, vnode } = this;

		if (typeof condition !== "function") {
			condition && vnode.mount(ctx);
			return;
		}

		const { parent, childIndex: index } = ctx;
		let node: ChildNode | null = null;

		new Effect(() => {
			if (condition()) {
				if (!node) {
					node = this.renderNode();
				}
				if (index >= parent.childNodes.length) {
					parent.appendChild(node);
				} else {
					parent.insertBefore(node, parent.childNodes.item(index));
				}
			} else {
				node?.remove();
			}
		}, true);
	}
}

export function mount(to: ParentNode, ...vnodes: Gotei.VNode[]) {
	const ctx = { parent: to, childIndex: to.childElementCount };
	for (const vnode of vnodes) {
		vnode.mount(ctx);
		ctx.childIndex++;
	}
}
