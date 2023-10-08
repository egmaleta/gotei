export type OrComputed<T = any> = T | (() => T);
export type OrArray<T = any> = T | T[];

export type MountFunction<R = any> = {
	(parent?: ParentNode, index?: number): R;
};

export const EVENT_LISTENER_PREFIX = "on";
export const CSS_VAR_PREFIX = "--";
const WHITESPACE = /\s+/;

export function setCSSVar(el: HTMLElement, prop: string, value: string) {
	el.style.setProperty(prop, value);
}

export function setCSSProp(el: HTMLElement, prop: any, value: string) {
	el.style[prop] = value;
}

export function cls2Tokens(cls: string) {
	return cls.trim().split(WHITESPACE);
}

export function addEventListener(
	target: EventTarget,
	name: string,
	handler: any,
) {
	const handlers = Array.isArray(handler) ? handler : [handler];

	for (const handler of handlers) {
		if (typeof handler === "function") {
			target.addEventListener(name, handler);
		} else {
			target.addEventListener(name, handler.handler, handler.options);
		}
	}
}

export function setAttribute(el: Element, name: string, attr: any) {
	if (typeof attr === "string" || typeof attr === "number") {
		el.setAttribute(name, `${attr}`);
	} else if (attr === true) {
		el.setAttribute(name, "");
	} else {
		el.removeAttribute(name);
	}
}

export function* flatten<T>(array: OrArray<T>[]): Generator<T> {
	for (const maybeArray of array) {
		if (!Array.isArray(maybeArray)) {
			yield maybeArray;
		} else {
			for (const item of flatten(maybeArray)) {
				yield item;
			}
		}
	}
}

export function mount(node: Node, to: ParentNode, at?: number) {
	if (typeof at === "undefined" || at >= to.childNodes.length) {
		to.appendChild(node);
	} else {
		to.insertBefore(node, to.childNodes.item(at));
	}
}
