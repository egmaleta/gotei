export const EVENT_LISTENER_PREFIX = "on";
export const CSS_VAR_PREFIX = "--";
const WHITESPACE = /\s+/;

export function setCSSVar(el, prop, value) {
	el.style.setProperty(prop, value);
}

export function setCSSProp(el, prop, value) {
	el.style[prop] = value;
}

export function cls2Tokens(cls) {
	return cls.trim().split(WHITESPACE);
}

export function addEventListener(target, name, handler) {
	const handlers = Array.isArray(handler) ? handler : [handler];

	for (const handler of handlers) {
		if (typeof handler === "function") {
			target.addEventListener(name, handler);
		} else {
			target.addEventListener(name, handler.handler, handler.options);
		}
	}
}

export function setAttribute(element, name, attr) {
	if (typeof attr === "string" || typeof attr === "number") {
		element.setAttribute(name, `${attr}`);
	} else if (attr === true) {
		element.setAttribute(name, "");
	} else {
		element.removeAttribute(name);
	}
}

export function renderOrphanNode(vnode) {
	const fragment = document.createDocumentFragment();
	render(vnode, { parent: fragment, childIndex: -1 });

	return fragment.lastChild;
}

export function* flatten(maybeArray) {
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
