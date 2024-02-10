import { createComputation } from "../function";
import { effect } from "../state";
import { attr } from "./attr";

function setAttribute(this: Element, name: string, attr: any) {
  if (typeof attr === "string" || typeof attr === "number") {
    this.setAttribute(name, `${attr}`);
  } else if (attr === true) {
    this.setAttribute(name, "");
  } else {
    this.removeAttribute(name);
  }
}

const RX_ATTR_PREFIX = attr("rx:");

function handleReactiveAttrs(element: Element) {
  for (const attr of element.attributes) {
    if (!attr.name.startsWith(RX_ATTR_PREFIX)) continue;

    const name = attr.name.slice(RX_ATTR_PREFIX.length);

    const expr = attr.value;
    const comp = createComputation(element, expr);

    const setAttr = setAttribute.bind(element, name);

    if ("v" in comp) {
      effect(() => setAttr(comp.v));
    } else {
      setAttr(comp());
    }
  }
}

export { handleReactiveAttrs };
