import { Window } from "happy-dom";

import { render } from "./lib/runtime";
import type { IDocument, MountFunction } from "./lib/runtime";

const defaultDocument: IDocument = new Window().document as any;

export function renderToString<T extends HTMLElement | Text>(
  mf: MountFunction<T>,
  document?: IDocument
) {
  const node = render(mf, document ?? defaultDocument);

  return "outerHTML" in node ? node.outerHTML : node.data;
}
