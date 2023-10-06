import { define } from "../oop";
import { Effect } from "../state/effect";
import { typeSymbol } from "../symbols";
import { renderOrphanNode } from "./utils";

export function ArrayVNode(f, items) {
	this[typeSymbol] = "array";
	this.f = f;
	this.items = items;
}

define(ArrayVNode, {
	mount(ctx) {
		const { parent } = ctx;
		const { f, items } = this;

		const cache = new Map();
		let positions = [];

		new Effect((ctx) => {
			if (!ctx) {
				for (const item of items()) {
					const vn = f(item);
					const node = renderOrphanNode(vn);
					cache.set(vn.props.key, node);
					positions.push(vn.props.key);
					parent.appendChild(node);
				}
			} else {
				const { op, args } = ctx;
				if (op === "setat") {
					const vn = f(items()[args.index]);

					const key = vn.props.key;
					const node = renderOrphanNode(vn);

					const oldKey = positions[args.index];
					const oldNode = cache.get(oldKey);

					cache.delete(oldKey);
					cache.set(key, node);
					positions[args.index] = vn.props.key;
					oldNode && parent.replaceChild(node, oldNode);
				} else if (op === "pop" || op === "shift") {
					items();

					const key = positions[op === "pop" ? -1 : 0];
					const node = cache.get(key);

					positions[op]();
					cache.delete(key);
					node && parent.removeChild(node);
				} else if (op === "push" || op === "unshift") {
					const slice =
						op === "push" ? items().slice(-args.n) : items().slice(0, args.n);
					const vns = slice.map((item) => f(item));

					const keys = vns.map((vn) => vn.props.key);
					const nodes = vns.map((vn) => renderOrphanNode(vn));

					positions[op](...keys);
					for (let i = 0; i < keys.length; i++) cache.set(keys[i], nodes[i]);

					const parentOp = op === "push" ? "append" : "prepend";
					parent[parentOp](...nodes);
				} else if (op === "sort" || op === "reverse") {
					const vns = items().map((item) => f(item));

					const keys = vns.map((vn) => vn.props.key);
					positions = keys;
					for (const key of keys) {
						const node = cache.get(key);
						node && parent.appendChild(node);
					}
				} else if (op === "set") {
					const vns = items().map((item) => f(item));

					const keys = vns.map((vn) => vn.props.key);
					const nodes = vns.map(
						(vn) => cache.get(vn.props.key) ?? renderOrphanNode(vn),
					);

					for (const node of cache.values()) parent.removeChild(node);
					cache.clear();

					parent.append(...nodes);
					positions = keys;
					for (let i = 0; i < keys.length; i++) cache.set(keys[i], nodes[i]);
				}
				// TODO: handle "splice" prop
			}
		}, true);
	},
});

export function map(f, over) {
	return new ArrayVNode(f, over);
}
