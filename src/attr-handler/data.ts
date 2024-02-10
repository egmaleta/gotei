import { createFunction, createSignal } from "../function";
import { setVar } from "../store";

function handleData(element: HTMLElement) {
  const dataset = element.dataset;
  for (const name in dataset) {
    const expr = dataset[name]!;

    if (name.startsWith("$")) {
      const s = createSignal(element, expr);
      setVar(element, name.slice(1), s);
    } else {
      const f = createFunction(element, `return ${expr};`);
      setVar(element, name, f());
    }
  }
}

export { handleData };
