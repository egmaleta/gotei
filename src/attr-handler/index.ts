import { attr } from "./attr";
import { handleData } from "./data";
import {
  handleHideableElement,
  handleReactiveList,
  handleTextContent,
  isFragment,
} from "./dom";
import { handleEvent } from "./event";
import { handleReactiveAttr } from "./reactive";

const TEXT_ATTR = attr("text");
const SHOW_ATTR = attr("show");
const LIST_ATTR = attr("list");
const EVENT_ATTR_PREFIX = attr("on:");
const RX_ATTR_PREFIX = attr("rx:");

function handle(element: HTMLElement) {
  handleData(element);

  for (const { name, value } of element.attributes) {
    // I HATE THIS
    switch (true) {
      case name.startsWith(RX_ATTR_PREFIX):
        handleReactiveAttr(element, name.slice(RX_ATTR_PREFIX.length), value);
        break;
      case name.startsWith(EVENT_ATTR_PREFIX):
        handleEvent(element, name.slice(EVENT_ATTR_PREFIX.length), value);
        break;
      case name === TEXT_ATTR:
        handleTextContent(element, value);
        break;
      case name === SHOW_ATTR:
        handleHideableElement(element, value);
        break;
      case name === LIST_ATTR:
        handleReactiveList(element, value);
        break;
    }
  }
}

function handleTree(element: HTMLElement) {
  handle(element);

  for (const child of element.children) {
    handleTree(child as HTMLElement);
  }
}

export { handle, handleTree, isFragment };
