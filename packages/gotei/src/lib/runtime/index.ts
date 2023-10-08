import { MountFunction } from "./utils";

export { type MountFunction };
export { type Gotei } from "./ns";

export * from "./h";
export * from "./text";
export * from "./array";
export * from "./conditional";
export { config } from "./context";

export function mount(nodeOrMF: Node | MountFunction, parent: ParentNode) {
	typeof nodeOrMF === "function"
		? nodeOrMF(parent)
		: parent.appendChild(nodeOrMF);
}
