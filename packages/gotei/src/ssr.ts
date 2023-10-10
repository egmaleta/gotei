import { Window } from "happy-dom";

import { render } from "./lib/runtime";
import type { IDocument, RenderFunction } from "./lib/runtime";

const defaultDocument: IDocument = new Window().document as any;

export function renderToString<T extends HTMLElement | Text>(
  rf: RenderFunction<T>,
  document?: IDocument
) {
  const node = render(rf, document ?? defaultDocument);

  return "outerHTML" in node ? node.outerHTML : node.data;
}
