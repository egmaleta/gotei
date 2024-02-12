import { createComputation, createDerivedSignal } from "../function";
import { TrackedArrayOp, effect } from "../state";
import { setVar } from "../store";
import { attr, isEmpty } from "./attr";
import { DATA_ATTR_PREFIX } from "./data";

function handleTextContent(element: Element, textExpr: string) {
  const comp = createComputation(element, textExpr);

  if ("v" in comp) {
    effect(() => (element.textContent = comp.v));
  } else {
    element.textContent = comp();
  }
}

function handleHideableElement(element: HTMLElement, conditionExpr: string) {
  const comp = createComputation(element, conditionExpr);

  if ("v" in comp) {
    const display = element.style.display;
    effect(() => {
      if (comp.v) {
        element.style.display = display;
      } else {
        element.style.display = "none";
      }
    });
  } else {
    if (!comp()) {
      element.style.display = "none";
    }
  }
}

const ITEM_NAME_ATTR = attr("item-name");
const LIST_NAME_ATTR = attr("list-name");

const DEFAULT_ITEM_NAME = "item";
const DEFAULT_LIST_NAME = "items";

const $IS_FRAGMENT = Symbol();

function isFragment(element: Element): boolean {
  // @ts-ignore
  return element[$IS_FRAGMENT] ?? false;
}

function createElement(
  template: Element,
  listName: string,
  itemName: string,
  itemIndex: number,
) {
  const element = template.cloneNode(true) as HTMLElement;
  element.setAttribute(
    `${DATA_ATTR_PREFIX}${itemName}|rx`,
    `${listName}[${itemIndex}]`,
  );

  // @ts-ignore
  element[$IS_FRAGMENT] = true;

  return element;
}

function handleReactiveList(element: Element, listExpr: string) {
  const template = element.querySelector("template")?.content.firstElementChild;
  if (!template) return;

  const _name = element.getAttribute(LIST_NAME_ATTR);
  const name = isEmpty(_name) ? DEFAULT_LIST_NAME : _name;

  const _itemName = element.getAttribute(ITEM_NAME_ATTR);
  const itemName = isEmpty(_itemName) ? DEFAULT_ITEM_NAME : _itemName;

  const list = createDerivedSignal(element, listExpr);
  const create = createElement.bind(null, template, name, itemName);

  effect<TrackedArrayOp>((op) => {
    const newData = list.v as any[];
    setVar(element, name, newData);

    if (op) {
      switch (op) {
        case "pop":
          element.lastElementChild?.remove();
          break;
        case "shift":
          element.firstElementChild?.remove();
          break;
        case "push":
          for (let i = element.children.length; i < newData.length; i++) {
            const node = create(i);
            element.appendChild(node);
          }
          break;
        case "unshift":
          const first = element.firstElementChild;
          for (let i = 0; i < newData.length - element.children.length; i++) {
            const node = create(i);
            element.insertBefore(node, first);
          }
          break;
        case "reverse":
          for (
            let i = 0, j = element.children.length - 1;
            j - i >= 1;
            i++, j--
          ) {
            const ith = element.children[i];
            const jth = element.children[j];

            const ithNext = ith.nextElementSibling;
            if (ithNext === jth) {
              jth.remove();
              element.insertBefore(jth, ith);
            } else {
              const jthNext = jth.nextElementSibling;
              ith.remove();
              jth.remove();
              element.insertBefore(jth, ithNext);
              element.insertBefore(ith, jthNext);
            }
          }
          break;
        default:
          for (
            let i = 0;
            i < op.deleteCount && op.start + i < element.children.length;
            i++
          ) {
            element.children[op.start + i].remove();
          }

          const newNodes = [];
          for (let i = 0; i < op.insertCount; i++) {
            newNodes.push(create(op.start + i));
          }

          if (op.start === element.children.length) {
            element.append(...newNodes);
          } else {
            const child = element.children.item(op.start);
            for (const node of newNodes) {
              element.insertBefore(node, child);
            }
          }
      }
    } else {
      while (element.firstElementChild) {
        element.firstElementChild.remove();
      }
      for (let i = 0; i < newData.length; i++) {
        element.appendChild(create(i));
      }
    }
  });
}

export {
  handleTextContent,
  handleHideableElement,
  handleReactiveList,
  isFragment,
};
