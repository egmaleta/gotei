import { handleData } from "./attr-handler/data";
import {
  handleListAttr,
  handleShowAttr,
  handleTextAttr,
  $IS_FRAGMENT,
} from "./attr-handler/dom";
import { handleEventAttrs } from "./attr-handler/event";
import { handleReactiveAttrs } from "./attr-handler/reactive";

const $OBSERVED = Symbol();

function handle(element: HTMLElement) {
  handleData(element);
  handleReactiveAttrs(element);
  handleEventAttrs(element);
  handleTextAttr(element);
  handleShowAttr(element);
  handleListAttr(element);
}

function handleTree(element: HTMLElement) {
  handle(element);

  for (const child of element.children) {
    handleTree(child as HTMLElement);
  }
}

function isElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isElement(target) || target.nodeName === "HEAD") continue;

    for (const node of addedNodes) {
      if (!isElement(node)) continue;

      // @ts-ignore
      if (!node[$OBSERVED]) {
        // @ts-ignore
        if (node[$IS_FRAGMENT]) {
          handleTree(node);
        } else {
          handle(node);
        }

        // @ts-ignore
        node[$OBSERVED] = true;
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { observer };
