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

	for (const [name, attr] of Object.entries(vnode.props)) {
		if (name.startsWith(EVENT_LISTENER_PREFIX)) {
			addEventListener(el, name.slice(EVENT_LISTENER_PREFIX.length), attr);
		} else if (typeof attr !== "function") {
			setAttribute(el, name, attr);
		} else {
			new Effect(() => {
				setAttribute(el, name, attr());
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
