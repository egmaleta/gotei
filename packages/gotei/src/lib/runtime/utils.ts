export type OrComputed<T = any> = T | (() => T);
export type OrArray<T = any> = T | T[];

export const EVENT_LISTENER_PREFIX = "on";
export const CSS_VAR_PREFIX = "--";

export function setCSSVar(el: HTMLElement, prop: string, value: string) {
	el.style.setProperty(prop, value);
}

export function setCSSProp(el: HTMLElement, prop: any, value: string) {
	el.style[prop] = value;
}

const WHITESPACE = /\s+/;

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

export function setAttribute(element: Element, name: string, attr: any) {
	if (typeof attr === "string" || typeof attr === "number") {
		element.setAttribute(name, `${attr}`);
	} else if (attr === true) {
		element.setAttribute(name, "");
	} else {
		element.removeAttribute(name);
	}
}

export function* flatten<T>(maybeArray: OrArray<T>): Generator<T> {
	if (Array.isArray(maybeArray)) {
		for (const maybeArrayItem of maybeArray) {
			for (const item of flatten(maybeArrayItem)) {
				yield item;
			}
		}
	} else {
		yield maybeArray;
	}
}
