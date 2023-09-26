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

export function renderVNode<T extends Gotei.Tag>(
	vnode: Gotei.VNode<T>,
): HTMLElementTagNameMap[T] {
	const domEl = document.createElement(vnode[tagSymbol]);

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

		domEl.appendChild(text);
	}

	for (const [name, prop] of Object.entries(props)) {
		if (name.startsWith(EVENT_LISTENER_PREFIX)) {
			addEventListener(domEl, name.slice(EVENT_LISTENER_PREFIX.length), prop);
		} else if (typeof prop !== "function") {
			setAttribute(domEl, name, prop);
		} else {
			new Effect(() => {
				setAttribute(domEl, name, prop());
			}, true);
		}
	}

	for (const child of vnode.children) {
		const childEl = renderElement(child);
		childEl && domEl.appendChild(childEl);
	}

	return domEl;
}

export function renderElement(el: Gotei.Element) {
	if (typeof el === "undefined" || typeof el === "boolean" || el === null) {
		return null;
	}

	if (typeof el !== "object") {
		return document.createTextNode(`${el}`);
	}

	return renderVNode(el);
}

export function append(node: Node, element: Gotei.Element | Gotei.Element[]) {
	const elements = Array.isArray(element) ? element : [element];

	for (const domEl of elements.map((el) => renderElement(el))) {
		domEl && node.appendChild(domEl);
	}
}
