import { render } from "gotei";
import type { IDocument, RenderFunction } from "gotei/runtime";
import { Window } from "happy-dom";

const defaultDocument: IDocument = new Window().document as any;

export function renderToString<T extends HTMLElement | Text>(
  rf: RenderFunction<T>,
  document?: IDocument,
) {
  const node = render(rf, document ?? defaultDocument);

  return "outerHTML" in node ? node.outerHTML : node.data;
}
