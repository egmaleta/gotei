export interface IWindow extends Pick<typeof globalThis, "document" | "Node"> {}

class Context {
	private w: IWindow | null = null;

	config(window: IWindow) {
		this.w = window;
	}

	window() {
		if (!this.w) {
			this.w = globalThis;
		}

		return this.w;
	}
}

export const CONTEXT = new Context();
