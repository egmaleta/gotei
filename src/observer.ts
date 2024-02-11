import { handle, handleTree, isFragment } from "./attr-handler";

const $OBSERVED = Symbol();

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
        if (isFragment(node)) {
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
