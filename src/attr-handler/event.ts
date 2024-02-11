import { createFunction } from "../function";

function handleEvent(element: Element, names: string, stmt: string) {
  const eventName = names[0];

  const options: Record<string, boolean> = {};
  for (const name of names.slice(1)) {
    options[name] = true;
  }

  const f = createFunction(element, stmt, ["ev"]);

  element.addEventListener(
    eventName,
    (ev) => {
      ev.preventDefault();
      f(ev);
    },
    options,
  );
}

export { handleEvent };
