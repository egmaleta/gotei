import { createFunction } from "../function";

function handleEventAttr(element: Element, name: string, value: string) {
  const names = name.split("|");
  const eventName = names[0];
  const optionNames = names.slice(1);

  const f = createFunction(element, value, ["ev"]);

  const options: Record<string, boolean> = {};
  for (const name of optionNames) {
    options[name] = true;
  }

  element.addEventListener(
    eventName,
    (ev) => {
      ev.preventDefault();
      f(ev);
    },
    options,
  );
}

export { handleEventAttr };
