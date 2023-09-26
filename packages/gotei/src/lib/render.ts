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

export function render(element: Gotei.Element) {
	if (
		typeof element === "undefined" ||
		typeof element === "boolean" ||
		element === null
	) {
		return null;
	}

	if (typeof element !== "object") {
		return document.createTextNode(`${element}`);
	}

	const domElement = document.createElement(element[tagSymbol]);

	const { text: textProp, ...props } = element.props;

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

		domElement.appendChild(text);
	}

	for (const [name, prop] of Object.entries(props)) {
		if (name.startsWith(EVENT_LISTENER_PREFIX)) {
			addEventListener(
				domElement,
				name.slice(EVENT_LISTENER_PREFIX.length),
				prop,
			);
		} else if (typeof prop !== "function") {
			setAttribute(domElement, name, prop);
		} else {
			new Effect(() => {
				setAttribute(domElement, name, prop());
			}, true);
		}
	}

	for (const child of element.children) {
		const childElement = render(child);
		childElement && domElement.appendChild(childElement);
	}

	return domElement;
}

export function replace(node: Node, by: Gotei.Element) {
	const parent = node.parentNode;
	const domElement = render(by);
	parent && domElement && parent.replaceChild(domElement, node);
}
