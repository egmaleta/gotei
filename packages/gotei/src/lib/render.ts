import type { Gotei } from "./runtime";
import { Effect } from "./state";
import { tagSymbol } from "./symbols";

const EVENT_LISTENER_PREFIX = "on";

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

export function render<T extends Gotei.Tag>(vnode: Gotei.VNode<T>) {
	const el = document.createElement(vnode[tagSymbol]);

	const { text: textProp, ...props } = vnode.props;

	// handle special "text" prop
	if (typeof textProp !== "undefined") {
		const text = document.createTextNode("");

		if (typeof textProp !== "function") {
			text.data = `${textProp}`;
		} else {
			new Effect(() => {
				text.data = `${textProp()}`;
			}, true);
		}

		el.appendChild(text);
	}

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
		if (typeof child === "object") {
			child && el.appendChild(render(child));
		} else if (typeof child !== "undefined" && typeof child !== "boolean") {
			el.appendChild(document.createTextNode(`${child}`));
		}
	}

	return el;
}

export function replace(node: Node, by: Gotei.VNode) {
	const parent = node.parentNode;
	parent?.replaceChild(node, render(by));
}
