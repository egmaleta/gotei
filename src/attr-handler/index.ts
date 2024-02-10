import { handleData } from "./data";
import { handleDomAttr } from "./dom";
import { handleEventAttr } from "./event";
import { handleReactiveAttr } from "./reactive";
import { $OBSERVED } from "./symbols";

const IGNORED_ATTRS = [":item-name", ":list-name", ":item-key"];

const attrHandlers = [
  {
    pattern: /^:on(.+)$/,
    handler: handleEventAttr,
  },
  {
    pattern: /^:(text|show|list)$/,
    handler: handleDomAttr,
  },
  {
    pattern: /^:(.+)$/,
    handler: handleReactiveAttr,
  },
];

function handle(element: HTMLElement) {
  // @ts-ignore
  if (!element[$OBSERVED]) {
    handleData(element);

    for (const { name, value } of element.attributes) {
      if (IGNORED_ATTRS.indexOf(name) !== -1) continue;

      for (const { pattern, handler } of attrHandlers) {
        const match = pattern.exec(name);
        if (match !== null) {
          handler(element, match[1], value);
          break;
        }
      }
    }

    // @ts-ignore
    element[$OBSERVED] = true;
  }
}

function handleTree(element: HTMLElement) {
  handle(element);
  for (const child of element.children) {
    handleTree(child as HTMLElement);
  }
}

export { handle, handleTree };
