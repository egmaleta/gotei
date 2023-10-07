import { OrArray, OrComputed } from "./common";
import {
	Gotei,
	Tag,
	Props,
	AnyProps,
	HtmlVNodeChild,
	HtmlVNode,
	TextRenderizable,
	TextVNode,
	ConditionalVNode,
	Keyed,
	ArrayVNode,
} from "./runtime";

type Tags = {
	[T in Tag]: {
		<P extends AnyProps = AnyProps>(
			props: Props<T> & P,
			...children: OrArray<HtmlVNodeChild>[]
		): HtmlVNode<T, P>;
		(...children: OrArray<HtmlVNodeChild>[]): HtmlVNode<T>;
	};
};

export declare const tags: Tags;

export declare function text<T extends TextRenderizable>(
	data: OrComputed<T>,
): TextVNode<T>;

export declare function show<T extends HtmlVNode | TextVNode>(
	vnode: T,
	condition: OrComputed<boolean>,
): ConditionalVNode<T>;

export declare function ternary<
	T extends HtmlVNode | TextVNode,
	Q extends HtmlVNode | TextVNode,
>(
	yes: T,
	no: Q,
	condition: OrComputed<boolean>,
): (ConditionalVNode<T> | ConditionalVNode<Q>)[];

export declare function map<T>(
	items: () => T[],
	withF: (item: T) => Keyed<HtmlVNode>,
): ArrayVNode<T>;

export declare function mount(to: ParentNode, ...vnodes: Gotei.VNode[]): void;
export declare function replace(node: ChildNode, vnode: Gotei.VNode): void;
