import { isTextVNode, type Gotei } from "./runtime";
import { Effect } from "./state";
import { tagSymbol } from "./symbols";

const EVENT_LISTENER_PREFIX = "on";

const WHITESPACE = /\s+/;

const CSS_VAR_PREFIX = "--";

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

function renderText(vnode: Gotei.TextVNode) {
	const text = document.createTextNode("");
	const { data } = vnode;

	if (typeof data !== "function") {
		text.data = `${data}`;
	} else {
		new Effect(() => {
			text.data = `${data()}`;
		}, true);
	}

	return text;
}

export function render<T extends Gotei.Tag>(
	vnode: Gotei.HtmlVNode<T>,
): HTMLElementTagNameMap[T] {
	const el = document.createElement(vnode[tagSymbol]);

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

	for (const child of vnode.children) {
		if (
			typeof child === "undefined" ||
			typeof child === "boolean" ||
			child === null
		) {
			continue;
		}

		if (typeof child !== "object") {
			el.appendChild(document.createTextNode(`${child}`));
			continue;
		}

		if (isTextVNode(child)) {
			el.appendChild(renderText(child));
			continue;
		}

		el.appendChild(render(child));
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

	return el;
}

export function append(node: Node, ...vnodes: Gotei.HtmlVNode[]) {
	for (const el of vnodes.map((vnode) => render(vnode))) {
		el && node.appendChild(el);
	}
}
