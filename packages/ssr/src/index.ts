import { config, IWindow, MountFunction } from "gotei/runtime";
import { Window } from "happy-dom";

function register(window?: IWindow) {
	config(window ?? (new Window() as any));
}

function renderToString(element: HTMLElement): string;
function renderToString(mf: MountFunction<HTMLElement>): string;
function renderToString(x: HTMLElement | MountFunction<HTMLElement>) {
	return (typeof x === "function" ? x() : x).outerHTML;
}

export { register, renderToString };
