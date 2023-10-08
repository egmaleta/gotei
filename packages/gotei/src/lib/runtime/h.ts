import { Effect } from "../state/effect";
import { document } from "./context";
import { Gotei } from "./ns";
import {
	CSS_VAR_PREFIX,
	EVENT_LISTENER_PREFIX,
	addEventListener,
	cls2Tokens,
	setAttribute,
	setCSSProp,
	setCSSVar,
	flatten,
	OrArray,
	MountFunction,
	mount,
} from "./utils";

type Child =
	| MountFunction
	| Node
	| string
	| number
	| boolean
	| undefined
	| null;

type AnyProps = Record<string, any>;

export function h<T extends Gotei.Tag, P extends AnyProps>(
	tag: T,
	props: Gotei.Attrs<T> & P,
	children: Child[],
): MountFunction<HTMLElementTagNameMap[T]> {
	const doc = document();
	const el = doc.createElement(tag);

	const {
		bindThis,
		bindValue,
		use,
		classList,
		classRecord,
		styleRecord,
		...rest
	} = props;

	for (const [name, prop] of Object.entries(rest)) {
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

	let index = 0;
	for (const child of children) {
		if (
			typeof child === "boolean" ||
			typeof child === "undefined" ||
			child === null
		) {
			continue;
		}

		if (child instanceof Node) {
			el.appendChild(child);
		} else if (typeof child === "string" || typeof child === "number") {
			el.appendChild(doc.createTextNode(`${child}`));
		} else {
			child(el, index);
		}
		index++;
	}

	if (bindValue) {
		const isNumber = typeof bindValue() === "number";

		new Effect(() => {
			setAttribute(el, "value", bindValue());
		}, true);
		addEventListener(el, "input", (ev: any) => {
			const value = ev.currentTarget.value;
			// @ts-ignore
			bindValue.set(isNumber ? Number.parseFloat(value) : value);
		});
	}

	if (classList) {
		for (const cls of classList) {
			if (typeof cls !== "function") {
				el.classList.add(...cls2Tokens(cls));
			} else {
				let tokens: string[] = [];

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

	return (parent, index) => {
		mount(el, parent, index);

		// @ts-ignore
		bindThis?.set(el);

		if (use) {
			if (Array.isArray(use)) {
				for (const f of use) f(el as any);
			} else {
				use(el as any);
			}
		}

		return el;
	};
}

type Tags = {
	[T in Gotei.Tag]: {
		<P extends AnyProps>(
			props: Gotei.Attrs<T> & P,
			...children: OrArray<Child>[]
		): MountFunction<HTMLElementTagNameMap[T]>;
		(...children: OrArray<Child>[]): MountFunction<HTMLElementTagNameMap[T]>;
	};
};

export const tags = new Proxy(
	{},
	{
		get(_, tag: any) {
			return (...args: any[]) => {
				if (args.length > 0) {
					const head = args[0];
					if (
						typeof head === "object" &&
						head &&
						!Array.isArray(head) &&
						!(head instanceof Node)
					) {
						return h(tag, head, [...flatten(args.slice(1))]);
					}
				}

				return h(tag, {}, [...flatten(args)]);
			};
		},
	},
) as Tags;
