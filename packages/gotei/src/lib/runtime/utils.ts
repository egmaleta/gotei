export type OrComputed<T = any> = T | (() => T);
export type OrArray<T = any> = T | T[];

export interface IDocument
  extends Pick<Document, "createElement" | "createTextNode"> {}

export type RenderContext = {
  parent?: ParentNode;
  childIndex?: number;
  document: IDocument;
};

export type RenderFunction<R = any> = {
  (ctx: RenderContext): R;
};

export function mount(node: Node, to: ParentNode, at?: number) {
  if (typeof at === "undefined" || at >= to.childNodes.length) {
    to.appendChild(node);
  } else {
    to.insertBefore(node, to.childNodes.item(at));
  }
}
