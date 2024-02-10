import { createComputation } from "../function";
import { effect } from "../state";

function setAttribute(this: Element, name: string, attr: any) {
  if (typeof attr === "string" || typeof attr === "number") {
    this.setAttribute(name, `${attr}`);
  } else if (attr === true) {
    this.setAttribute(name, "");
  } else {
    this.removeAttribute(name);
  }
}

function handleReactiveAttr(element: Element, name: string, value: string) {
  const comp = createComputation(element, value);
  const setAttr = setAttribute.bind(element, name);

  if ("v" in comp) {
    effect(() => setAttr(comp.v));
  } else {
    setAttr(comp());
  }
}

export { handleReactiveAttr };
