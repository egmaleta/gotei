import { Effect } from "../state/effect";
import { MountFunction } from "./utils";

export function map<T extends object, K extends keyof T>(
	items: () => T[],
	key: K,
	f: (item: T) => MountFunction<Node>,
): MountFunction<Node[]> {
	return (parent: ParentNode) => {
		const cache = new Map<T[K], Node>();
		let currentIds: T[K][] = [];

		new Effect((ctx: { op: string; [arg: string]: any } | null) => {
			if (!ctx) {
				// first render
				for (const item of items()) {
					const id = item[key];
					const mf = f(item);
					const node = mf(parent);

					cache.set(id, node);
					currentIds.push(id);
				}
			} else {
				const { op } = ctx;
				if (op === "setat") {
					const { index } = ctx;

					// remove old node
					const oldId = currentIds[index];
					const oldNode = cache.get(oldId);
					cache.delete(oldId);
					oldNode && parent.removeChild(oldNode);

					// insert new node
					const item = items()[index];
					const id = item[key];
					const mf = f(item);
					const node = mf(parent, index);
					cache.set(id, node);
					currentIds[index] = id;
				} else if (op === "pop" || op === "shift") {
					items(); // effects might clean up in the future, this will keep the subscription

					const oldId = currentIds[op === "pop" ? -1 : 0];
					const oldNode = cache.get(oldId);
					oldNode && parent.removeChild(oldNode);
					cache.delete(oldId);
					currentIds[op]();
				} else if (op === "push" || op === "unshift") {
					const slice =
						op === "push" ? items().slice(-ctx.n) : items().slice(0, ctx.n);

					const ids = slice.map((item) => item[key]);
					const mfs = slice.map((item) => f(item));
					const nodes =
						op === "push"
							? mfs.map((mf) => mf(parent))
							: mfs.map((mf, i) => mf(parent, i));
					currentIds[op](...ids);
					for (let i = 0; i < ids.length; i++) cache.set(ids[i], nodes[i]);
				} else if (op === "sort" || op === "reverse") {
					currentIds = items().map((item) => item[key]);
					for (const id of currentIds) {
						const node = cache.get(id);
						node && parent.appendChild(node);
					}
				} else if (op === "set") {
					// remove cached nodes
					for (const node of cache.values()) {
						parent.removeChild(node);
					}

					currentIds = [];
					const nodes = items().map((item) => {
						const id = item[key];
						currentIds.push(id);

						const oldNode = cache.get(id);
						if (oldNode) {
							return parent.appendChild(oldNode);
						}

						const mf = f(item);
						return mf(parent);
					});

					cache.clear();
					for (let i = 0; i < currentIds.length; i++)
						cache.set(currentIds[i], nodes[i]);
				}
			}
		}, true);

		// biome-ignore lint/style/noNonNullAssertion: `id` exists as key of `cache`
		return currentIds.map((id) => cache.get(id)!);
	};
}
