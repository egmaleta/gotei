import { MountFunction } from "./utils";
import { CONTEXT, IWindow } from "./context";

export type { MountFunction, IWindow };
export type { Gotei } from "./ns";

export * from "./h";
export * from "./text";
export * from "./array";
export * from "./conditional";

export function mount(nodeOrMF: Node | MountFunction, parent: ParentNode) {
	typeof nodeOrMF === "function"
		? nodeOrMF(parent)
		: parent.appendChild(nodeOrMF);
}

export const config = CONTEXT.config.bind(CONTEXT);
