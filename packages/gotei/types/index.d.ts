import { OrArray, OrComputed } from "./common";
import { Gotei } from "./runtime";

type Tags = {
	[T in Gotei.Tag]: {
		(
			props: Gotei.Props<T>,
			...children: OrArray<Gotei.Child>[]
		): Gotei.VNode<T>;
		(...children: OrArray<Gotei.Child>[]): Gotei.VNode<T>;
	};
};

export declare const tags: Tags;

export declare function text<T extends string | number | boolean>(
	data: OrComputed<T>,
): Gotei.VNode<"text">;

export declare function map<T>(
	f: (item: T) => Gotei.VNode<"html">,
	over: () => T[],
): Gotei.VNode<"array">;

export declare function show<T extends Gotei.VNode>(
	vnode: T,
	condition: OrComputed<boolean>,
): Gotei.VNode<"maybe">;

export declare function ternary<T extends Gotei.VNode, Q extends Gotei.VNode>(
	yes: T,
	no: Q,
	condition: OrComputed<boolean>,
): (T | Q)[];

export declare function mount(to: ParentNode, ...vnodes: Gotei.VNode[]): void;
