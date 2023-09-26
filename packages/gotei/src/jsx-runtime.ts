import { type Gotei as JSX, h } from "./runtime";

function* flatten<T>(list: T | T[]): Generator<T> {
	if (Array.isArray(list)) {
		for (const elementOrList of list) {
			for (const element of flatten(elementOrList)) {
				yield element;
			}
		}
	} else {
		yield list;
	}
}

function jsx<
	T extends JSX.Tag | JSX.Component,
	P extends Record<string, any> & { children?: JSX.Element | JSX.Element[] },
>(type: T, props: P) {
	const { children: dirtyChildren, ...rest } = props;

	let children: JSX.Element[];
	if (typeof dirtyChildren === "undefined") {
		children = [];
	} else {
		children = Array.isArray(dirtyChildren)
			? [...flatten(dirtyChildren)]
			: [dirtyChildren];
	}

	if (typeof type !== "function") {
		return h(type, rest, children);
	}

	return type(rest, children);
}

function Fragment<
	P extends Record<string, any> & { children?: JSX.Element | JSX.Element[] },
>(props: P) {
	return props.children;
}

export { jsx, jsx as jsxs, Fragment, type JSX };
