import { isTextVNode, type Gotei } from "./runtime";
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

	const { bindThis, bindValue, ...props } = vnode.props;

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

	return el;
}

export function append(node: Node, ...vnodes: Gotei.HtmlVNode[]) {
	for (const el of vnodes.map((vnode) => render(vnode))) {
		el && node.appendChild(el);
	}
}
