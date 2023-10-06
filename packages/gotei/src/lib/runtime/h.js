import { define } from "../oop";
import { Effect } from "../state/effect";
import { typeSymbol } from "../symbols";
import {
	CSS_VAR_PREFIX,
	EVENT_LISTENER_PREFIX,
	addEventListener,
	cls2Tokens,
	setAttribute,
	setCSSProp,
	setCSSVar,
	flatten,
} from "./utils";

function HtmlVNode(tag, props, children) {
	this[typeSymbol] = "html";
	this.tag = tag;
	this.props = props;
	this.children = children;
}

define(HtmlVNode, {
	mount(ctx) {
		const el = document.createElement(this.tag);

		const {
			bindThis,
			bindValue,
			use,
			classList,
			classRecord,
			styleRecord,
			...props
		} = this.props;

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

		const thisCtx = { parent: el, childIndex: 0 };
		for (const child of this.children) {
			if (
				typeof child === "boolean" ||
				typeof child === "undefined" ||
				!child
			) {
				continue;
			}

			if (typeof child === "object") {
				child.mount(thisCtx);
			} else {
				el.appendChild(document.createTextNode(`${child}`));
			}

			thisCtx.childIndex++;
		}

		if (bindValue) {
			const isNumber = typeof bindValue() === "number";

			new Effect(() => {
				setAttribute(el, "value", bindValue());
			}, true);
			addEventListener(el, "input", (ev) => {
				const value = ev.currentTarget.value;
				bindValue.set(isNumber ? Number.parseFloat(value) : value);
			});
		}

		if (classList) {
			for (const cls of classList) {
				if (typeof cls !== "function") {
					el.classList.add(...cls2Tokens(cls));
				} else {
					let tokens = [];

					new Effect(() => {
						el.classList.remove(...tokens);
						tokens = cls2Tokens(cls());
						el.classList.add(...tokens);
					}, true);
				}
			}
		}

		if (classRecord) {
			for (const [cls, ok] of Object.entries(classRecord)) {
				const tokens = cls2Tokens(cls);
				if (tokens.length === 0) continue;

				if (typeof ok !== "function") {
					ok && el.classList.add(...tokens);
				} else {
					new Effect(() => {
						if (ok()) {
							el.classList.add(...tokens);
						} else {
							el.classList.remove(...tokens);
						}
					}, true);
				}
			}
		}

		if (styleRecord) {
			for (const [prop, value] of Object.entries(styleRecord)) {
				const setFunction = prop.startsWith(CSS_VAR_PREFIX)
					? setCSSVar
					: setCSSProp;

				if (typeof value !== "function") {
					setFunction(el, prop, value);
				} else {
					new Effect(() => {
						setFunction(el, prop, value());
					}, true);
				}
			}
		}

		ctx.parent.appendChild(el);

		bindThis?.set(el);

		if (use) {
			if (Array.isArray(use)) {
				for (const f of use) f(el);
			} else {
				use(el);
			}
		}
	},
});

export function h(tag, props, children) {
	return new HtmlVNode(tag, props, children);
}

export const tags = new Proxy(
	{},
	{
		get(_, tag) {
			return (...args) => {
				if (args.length > 0) {
					const head = args[0];
					if (
						typeof head === "object" &&
						!Array.isArray(head) &&
						head !== null &&
						typeof head[typeSymbol] === "undefined"
					) {
						return h(tag, head, [...flatten(args.slice(1))]);
					}
				}
				return h(tag, {}, [...flatten(args)]);
			};
		},
	},
);
