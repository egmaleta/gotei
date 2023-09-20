import { type Internal, isTextVNode, TAG } from "./internal";
import { effect } from "./state";

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

function renderText(vnode: Internal.VNode<"text">) {
	if (vnode.children.length === 0) {
		return document.createTextNode("");
	}

	const textNodes = vnode.children.map((child) => {
		if (typeof child !== "function") {
			return document.createTextNode(`${child}`);
		}

		const text = document.createTextNode("");
		effect(() => text.replaceData(0, text.length, `${child()}`));
		return text;
	});

	if (textNodes.length === 1) {
		return textNodes[0];
	}

	const span = document.createElement("span");
	span.append(...textNodes);
	return span;
}

type RenderedElement<T extends Internal.Tag> =
	T extends keyof Internal.IntrinsicElements
		? HTMLElementTagNameMap[T]
		: Text | HTMLSpanElement;

export function render<T extends Internal.Tag>(vnode: Internal.VNode<T>) {
	if (isTextVNode(vnode)) {
		return renderText(vnode) as RenderedElement<T>;
	}

	const el = document.createElement(vnode[TAG]);

	for (const [name, attr] of Object.entries(vnode.props)) {
		if (name.startsWith(EVENT_LISTENER_PREFIX)) {
			addEventListener(el, name.slice(EVENT_LISTENER_PREFIX.length), attr);
		} else if (typeof attr !== "function") {
			setAttribute(el, name, attr);
		} else {
			effect(() => {
				setAttribute(el, name, attr());
			});
		}
	}

	for (const child of vnode.children) {
		if (typeof child === "object") {
			child && el.appendChild(render(child));
		} else if (typeof child !== "undefined" && typeof child !== "boolean") {
			el.appendChild(document.createTextNode(`${child}`));
		}
	}

	return el as RenderedElement<T>;
}
