export type OrComputed<T = any> = T | (() => T);
export type OrArray<T = any> = T | T[];

export type AnyProps = Record<string, any>;

export interface IDocument
  extends Pick<
    Document,
    "createElement" | "createTextNode" | "createDocumentFragment"
  > {}

export type MountContext = {
  document: IDocument;
  parent: ParentNode;
  childIndex: number;
};

export type MountFunction<
  R extends OrArray<Node> | null = OrArray<Node> | null,
> = {
  (ctx: MountContext): R;
};

export function mount(node: Node, to: ParentNode, at?: number) {
  if (typeof at === "undefined" || at >= to.childNodes.length) {
    to.appendChild(node);
  } else {
    to.insertBefore(node, to.childNodes.item(at));
  }
}
