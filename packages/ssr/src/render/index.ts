import {
	TextVNode,
	HtmlVNode,
	ArrayVNode,
	ConditionalVNode,
	Gotei,
	isHtmlVNode,
	isTextVNode,
	isConditionalVNode,
	isArrayVNode,
} from "gotei/runtime";
import {
	WHITESPACE,
	escapeHTML,
	handleClassTokenChunk,
	handleStyleRuleChunk,
	invalidAttr,
	isEmptyTag,
	renderAttr,
	styleRuleTemplate,
} from "./utils";

function renderHTML(vnode: HtmlVNode) {
	const { tag, props, children } = vnode;

	const chunks = [`<${tag}`];

	// handle props
	const {
		style,
		styleRecord,
		class: className,
		classList,
		classRecord,
		...rest
	} = props;

	const attrs = Object.entries(rest).map(([name, attr]) => {
		if (invalidAttr(name)) return "";
		const data = typeof attr === "function" ? attr() : attr;
		return renderAttr(name, data);
	});

	// handle style attrs, `style` is a chunk
	const rules: string[] = [];

	style && rules.push(...handleStyleRuleChunk(style));

	styleRecord &&
		rules.push(
			...Object.entries(styleRecord).map(([prop, value]) => {
				const data = typeof value === "function" ? value() : value;
				return styleRuleTemplate(prop, data);
			}),
		);

	rules.length > 0 &&
		attrs.push(renderAttr("style", rules.join(`;${WHITESPACE}`)));

	// handle class attrs
	// `className`, `classList` items & `classRecord` keys are potential chunks
	const tokens: string[] = [];

	className && tokens.push(...handleClassTokenChunk(className));

	if (classList) {
		for (const chunk of classList) {
			tokens.push(
				...handleClassTokenChunk(typeof chunk === "function" ? chunk() : chunk),
			);
		}
	}

	if (classRecord) {
		for (const [chunk, ok] of Object.entries(classRecord)) {
			if (typeof ok === "function" ? ok() : ok) {
				tokens.push(...handleClassTokenChunk(chunk));
			}
		}
	}

	tokens.length > 0 && attrs.push("class", tokens.join(WHITESPACE));

	attrs.length > 0 &&
		chunks.push(WHITESPACE, attrs.join(WHITESPACE), WHITESPACE);

	// close tag head
	chunks.push(">");

	// handle children
	if (!isEmptyTag(tag)) {
		const content = children
			.map((child) => {
				if (typeof child === "string") return escapeHTML(child);
				if (typeof child === "number") return `${child}`;
				if (typeof child === "object" && child) return render(child);
				return "";
			})
			.join("");

		chunks.push(content, `</${tag}>`);
	}

	return chunks.join("");
}

function renderText(vnode: TextVNode) {
	const { data } = vnode;
	const text = `${typeof data === "function" ? data() : data}`;

	return escapeHTML(text);
}

function renderConditional(vnode: ConditionalVNode) {
	const { vnode: vn, condition } = vnode;
	const shouldRender =
		typeof condition === "function" ? condition() : condition;

	return shouldRender ? render(vn) : "";
}

function renderArray(vnode: ArrayVNode) {
	const { f, items } = vnode;
	const vns = items().map(f);
	return vns.map((vn) => renderHTML(vn)).join("");
}

export function render(vnode: Gotei.VNode): string {
	if (isHtmlVNode(vnode)) return renderHTML(vnode);
	if (isTextVNode(vnode)) return renderText(vnode);
	if (isConditionalVNode(vnode)) return renderConditional(vnode);
	if (isArrayVNode(vnode)) return renderArray(vnode);
	throw new Error(`Unable to render unknow vnode: ${vnode}`);
}
