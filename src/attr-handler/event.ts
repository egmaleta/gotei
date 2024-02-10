import { createFunction } from "../function";
import { attr } from "./attr";

const EVENT_ATTR_PREFIX = attr("on:");

function handleEventAttrs(element: Element) {
  for (const attr of element.attributes) {
    if (!attr.name.startsWith(EVENT_ATTR_PREFIX)) continue;

    const names = attr.name.slice(EVENT_ATTR_PREFIX.length).split("|");

    const eventName = names[0];

    const options: Record<string, boolean> = {};
    for (const name of names.slice(1)) {
      options[name] = true;
    }

    const stmt = attr.value;
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
}

export { handleEventAttrs };
