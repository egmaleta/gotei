export * from "./h";
export * from "./text";
export * from "./conditional";
export * from "./array";

export function mount(to, ...vnodes) {
	const ctx = { parent: to, childIndex: to.childNodes.length };
	for (const vnode of vnodes) {
		vnode.mount(ctx);
		ctx.childIndex++;
	}
}
