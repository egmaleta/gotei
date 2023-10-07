import { Tag } from "gotei/runtime";

export const WHITESPACE = " ";
const CLASS_SEPARATOR = /\s+/;
const STYLE_RULE_SEPARATOR = /;\s*/;

const ESCAPE_LIST: (readonly [string, string])[] = [
	[`&`, `&amp;`],
	[`<`, `&lt;`],
	[`>`, `&gt;`],
	[`"`, `&quot;`],
	[`'`, `&#39;`],
];

const EMPTY_TAGS = new Set<Tag>([
	"area",
	"base",
	"br",
	"col",
	"embed",
	"hr",
	"img",
	"input",
	"link",
	"meta",
	"source",
	"track",
	"wbr",
]);

export function escapeHTML(text: string) {
	let result = text;
	for (const [searchString, replaceString] of ESCAPE_LIST) {
		result = result.replaceAll(searchString, replaceString);
	}
	return result;
}

export function isEmptyTag(tag: Tag) {
	return EMPTY_TAGS.has(tag);
}

const attrTemplate = (name: string, attr: string) => `${name}="${attr}"`;

export function renderAttr(name: string, attr: any) {
	if (typeof attr === "string" || typeof attr === "number") {
		return attrTemplate(name, `${attr}`);
	}
	if (attr === true) {
		return name;
	}
	return "";
}

const EXCLUDED_ATTRS = ["bindThis", "use", "bindValue"];

export function invalidAttr(name: string) {
	return name.startsWith("on") || EXCLUDED_ATTRS.includes(name);
}

export const styleRuleTemplate = (prop: string, value: string) =>
	`${prop}: ${value}`;

export function handleStyleRuleChunk(chunk: string) {
	return chunk.trim().split(STYLE_RULE_SEPARATOR);
}

export function handleClassTokenChunk(chunk: string) {
	return chunk.trim().split(CLASS_SEPARATOR);
}
