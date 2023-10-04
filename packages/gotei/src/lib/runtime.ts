import { Gotei } from "./ns";
import { Effect } from "./state/effect";
import { typeSymbol } from "./symbols";

interface RenderContext {
	parent: ParentNode;
	childIndex: number;
}

const EVENT_LISTENER_PREFIX = "on";
const CSS_VAR_PREFIX = "--";
const WHITESPACE = /\s+/;

function setCSSVar(el: HTMLElement, prop: string, value: string) {
	el.style.setProperty(prop, value);
}

function setCSSProp(el: HTMLElement, prop: any, value: string) {
	el.style[prop] = value;
}

function cls2Tokens(cls: string) {
	return cls.trim().split(WHITESPACE);
}

function addEventListener(target: EventTarget, name: string, handler: any) {
	const handlers = Array.isArray(handler) ? handler : [handler];

	for (const handler of handlers) {
		if (typeof handler === "function") {
			target.addEventListener(name, handler);
		} else {
			target.addEventListener(name, handler.handler, handler.options);
		}
	}
}

function setAttribute(element: Element, name: string, attr: any) {
	if (typeof attr === "string" || typeof attr === "number") {
		element.setAttribute(name, `${attr}`);
	} else if (attr === true) {
		element.setAttribute(name, "");
	} else {
		element.removeAttribute(name);
	}
}

function renderOrphanNode(vnode: Gotei.VNode) {
	const fragment = document.createDocumentFragment();
	render(vnode, { parent: fragment, childIndex: -1 });

	// biome-ignore lint/style/noNonNullAssertion: fragment has a child
	return fragment.lastChild!;
}

function isText(vnode: Gotei.VNode): vnode is Gotei.TextVNode {
	return vnode[typeSymbol] === "text";
}

function isConditional(vnode: Gotei.VNode): vnode is Gotei.ConditionalVNode {
	return vnode[typeSymbol] === "maybe";
}

function renderHTML<T extends Gotei.Tag>(
	vnode: Gotei.HTMLVNode<T>,
	ctx: RenderContext,
) {
	const el = document.createElement(vnode.tag);

	const {
		bindThis,
		bindValue,
		use,
		classList,
		classRecord,
		styleRecord,
		...props
	} = vnode.props;

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
	for (const child of vnode.children) {
		if (typeof child === "boolean" || typeof child === "undefined" || !child) {
			continue;
		}

		if (typeof child === "object") {
			render(child, thisCtx);
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

	bindThis?.set(el);

	if (use) {
		if (Array.isArray(use)) {
			for (const f of use) f(el as any);
		} else {
			use(el as any);
		}
	}
}

function renderText(vnode: Gotei.TextVNode, ctx: RenderContext) {
	const { data } = vnode;
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

function renderConditional(
	condVNode: Gotei.ConditionalVNode,
	ctx: RenderContext,
) {
	const { condition, vnode } = condVNode;

	if (typeof condition !== "function") {
		condition && render(vnode, ctx);
		return;
	}

	const { parent, childIndex: index } = ctx;
	let node: ChildNode | null = null;

	new Effect(() => {
		if (condition()) {
			if (!node) {
				node = renderOrphanNode(vnode);
			}
			if (index >= parent.childNodes.length) {
				parent.appendChild(node);
			} else {
				parent.insertBefore(node, parent.childNodes.item(index));
			}
		} else {
			node && parent.removeChild(node);
		}
	}, true);
}

function render(vnode: Gotei.VNode, ctx: RenderContext) {
	if (isText(vnode)) {
		renderText(vnode, ctx);
	} else if (isConditional(vnode)) {
		renderConditional(vnode, ctx);
	} else {
		renderHTML(vnode, ctx);
	}
}

export function mount(to: ParentNode, ...vnodes: Gotei.VNode[]) {
	const ctx = { parent: to, childIndex: to.childElementCount };
	for (const vnode of vnodes) {
		render(vnode, ctx);
		ctx.childIndex++;
	}
}
