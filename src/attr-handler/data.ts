import { createFunction, createSignal } from "../function";
import { setVar } from "../store";
import { attr } from "./attr";

const DATA_ATTR_PREFIX = attr("data:");

function handle(element: HTMLElement, attrSuffix: string, expr: string) {
  const name = attrSuffix;

  if (name.startsWith("$")) {
    const s = createSignal(element, expr);
    setVar(element, name.slice(1), s);
  } else {
    const f = createFunction(element, `return ${expr};`);
    setVar(element, name, f());
  }
}

export { handle, DATA_ATTR_PREFIX };
