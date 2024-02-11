(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.gotei = {}));
})(this, function(exports2) {
  "use strict";
  class GoteiConfig {
    constructor(_prefix) {
      this._prefix = _prefix;
    }
    get prefix() {
      return this._prefix;
    }
    set prefix(prefix2) {
      const p = prefix2.trim();
      if (p.length > 0) {
        this._prefix = p;
      }
    }
  }
  const config = new GoteiConfig("gt-");
  const prefix = document.documentElement.getAttribute("gotei-prefix");
  if (prefix !== null) {
    config.prefix = prefix;
  }
  function attr(name) {
    return `${config.prefix}${name}`;
  }
  function isEmpty(attr2) {
    return attr2 === null || attr2.length === 0;
  }
  let currentAction = null;
  function effect(action, ctx) {
    const temp = currentAction;
    currentAction = action;
    action(ctx);
    currentAction = temp;
  }
  function runEffects(actions, ctx) {
    for (const action of actions) {
      effect(action, ctx);
    }
  }
  const $IS_TRAP = Symbol();
  function trap(array, actions) {
    const arr = array[$IS_TRAP] ? [...array] : array;
    const proxy = new Proxy(arr, {
      get(target, method) {
        if (method === "push" || method === "unshift") {
          return (...items) => {
            const l = target.length;
            const nl = target[method](...items);
            nl !== l && runEffects(actions, method);
            return nl;
          };
        }
        if (method === "pop" || method === "shift") {
          return () => {
            const l = target.length;
            const item = target[method]();
            target.length !== l && runEffects(actions, method);
            return item;
          };
        }
        if (method === "splice") {
          return (start, deleteCount, ...items) => {
            const dc = deleteCount != null ? deleteCount : 0;
            const deleted = target.splice(start, dc, ...items);
            if (deleted.length > 0 || items.length > 0) {
              runEffects(actions, {
                start,
                deleteCount: dc,
                insertCount: items.length
              });
            }
            return deleted;
          };
        }
        if (method === "reverse") {
          return () => {
            const reversed = target.reverse();
            reversed.length > 1 && runEffects(actions, method);
            return reversed;
          };
        }
        if (method === "sort") {
          return (compareFn) => {
            const old = [...target];
            const sorted = target.sort(compareFn);
            for (let i = 0; i < sorted.length; i++) {
              if (old[i] !== sorted[i]) {
                runEffects(actions);
                break;
              }
            }
            return sorted;
          };
        }
        return target[method];
      }
    });
    proxy[$IS_TRAP] = true;
    return proxy;
  }
  class Signal {
    constructor(value) {
      this.actions = /* @__PURE__ */ new Set();
      this.value = Array.isArray(value) ? trap(value, this.actions) : value;
    }
    get v() {
      currentAction && this.actions.add(currentAction);
      return this.value;
    }
    get uv() {
      return this.value;
    }
    set v(value) {
      if (value !== this.value) {
        this.value = Array.isArray(value) ? trap(value, this.actions) : value;
        runEffects(this.actions);
      }
    }
  }
  function signal(value) {
    return new Signal(value);
  }
  function untrap(f) {
    const v = f();
    if (Array.isArray(v) && v[$IS_TRAP]) {
      return [...v];
    }
    return v;
  }
  function untrack(f) {
    const temp = currentAction;
    currentAction = null;
    const value = f();
    currentAction = temp;
    return value;
  }
  class DerivedSignal {
    constructor(f) {
      this.f = untrap.bind(null, f);
    }
    get v() {
      return this.f();
    }
    get uv() {
      return untrack(this.f);
    }
  }
  function derived(computation) {
    return new DerivedSignal(computation);
  }
  const $STORE = Symbol();
  function setVar(element, name, value) {
    let store;
    if ($STORE in element) {
      store = element[$STORE];
    } else {
      store = /* @__PURE__ */ new Map();
      element[$STORE] = store;
    }
    store.set(name, value);
  }
  function* ancestors(element) {
    let p = element;
    while (p !== null && p.tagName !== "HTML") {
      yield p;
      p = p.parentElement;
    }
  }
  function getVar(element, name) {
    for (const el of ancestors(element)) {
      if ($STORE in el) {
        const store = el[$STORE];
        if (store.has(name)) {
          return store.get(name);
        }
      }
    }
    return null;
  }
  function getNamedVars(element) {
    const superStore = /* @__PURE__ */ new Map();
    for (const el of ancestors(element)) {
      if ($STORE in el) {
        const store = el[$STORE];
        for (const [key, value] of store.entries()) {
          if (!superStore.has(key)) {
            superStore.set(key, value);
          }
        }
      }
    }
    return [...superStore.entries()];
  }
  const TRACKED_PATTERN = /\$(\w+)/g;
  const UNTRACKED_PATTERN = /&(\w+)/g;
  function normalizeCode(code) {
    return code.replace(TRACKED_PATTERN, (_, name) => `${name}.v`).replace(UNTRACKED_PATTERN, (_, name) => `${name}.uv`);
  }
  function createFunction(element, code, params = [], args = []) {
    const body = `"use strict"; ${normalizeCode(code)}`;
    const namedVars = getNamedVars(element);
    params = namedVars.map(([name, _]) => name).concat(params);
    args = namedVars.map(([_, v]) => v).concat(args);
    return new Function(...params, body).bind(element, ...args);
  }
  function createSignal(element, expr) {
    const f = createFunction(element, `return ${expr};`);
    if (TRACKED_PATTERN.test(expr)) {
      return derived(f);
    }
    return signal(f());
  }
  function createComputation(element, expr) {
    const f = createFunction(element, `return ${expr};`);
    if (TRACKED_PATTERN.test(expr)) {
      return derived(f);
    }
    return f;
  }
  function handleData(element) {
    const dataset = element.dataset;
    for (const name in dataset) {
      const expr = dataset[name];
      if (name.startsWith("$")) {
        const s = createSignal(element, expr);
        setVar(element, name.slice(1), s);
      } else {
        const f = createFunction(element, `return ${expr};`);
        setVar(element, name, f());
      }
    }
  }
  function handleTextContent(element, textExpr) {
    const comp = createComputation(element, textExpr);
    if ("v" in comp) {
      effect(() => element.textContent = comp.v);
    } else {
      element.textContent = comp();
    }
  }
  function handleHideableElement(element, conditionExpr) {
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
  function isFragment(element) {
    var _a;
    return (_a = element[$IS_FRAGMENT]) != null ? _a : false;
  }
  function createElement(template, listName, itemName, itemIndex) {
    const element = template.cloneNode(true);
    element.dataset[itemName] = `${listName}[${itemIndex}]`;
    element[$IS_FRAGMENT] = true;
    return element;
  }
  function handleReactiveList(element, listExpr) {
    var _a;
    const template = (_a = element.querySelector("template")) == null ? void 0 : _a.content.firstElementChild;
    if (!template)
      return;
    const _name = element.getAttribute(LIST_NAME_ATTR);
    const name = isEmpty(_name) ? DEFAULT_LIST_NAME : _name;
    const _itemName = element.getAttribute(ITEM_NAME_ATTR);
    const itemName = isEmpty(_itemName) ? DEFAULT_ITEM_NAME : _itemName;
    const list = createSignal(element, listExpr);
    const create = createElement.bind(null, template, name, itemName);
    effect((op) => {
      var _a2, _b;
      const newData = list.v;
      setVar(element, name, newData);
      if (op) {
        switch (op) {
          case "pop":
            (_a2 = element.lastElementChild) == null ? void 0 : _a2.remove();
            break;
          case "shift":
            (_b = element.firstElementChild) == null ? void 0 : _b.remove();
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
            for (let i = 0, j = element.children.length - 1; j - i >= 1; i++, j--) {
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
            for (let i = 0; i < op.deleteCount && op.start + i < element.children.length; i++) {
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
  function handleEvent(element, attrSuffix, stmt) {
    const names = attrSuffix.split("|");
    const eventName = names[0];
    const options = {};
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
      options
    );
  }
  function setAttribute(name, attr2) {
    if (typeof attr2 === "string" || typeof attr2 === "number") {
      this.setAttribute(name, `${attr2}`);
    } else if (attr2 === true) {
      this.setAttribute(name, "");
    } else {
      this.removeAttribute(name);
    }
  }
  function handleReactiveAttr(element, attrName, expr) {
    const comp = createComputation(element, expr);
    const setAttr = setAttribute.bind(element, attrName);
    if ("v" in comp) {
      effect(() => setAttr(comp.v));
    } else {
      setAttr(comp());
    }
  }
  const TEXT_ATTR = attr("text");
  const SHOW_ATTR = attr("show");
  const LIST_ATTR = attr("list");
  const EVENT_ATTR_PREFIX = attr("on:");
  const RX_ATTR_PREFIX = attr("rx:");
  function handle(element) {
    handleData(element);
    for (const { name, value } of element.attributes) {
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
  function handleTree(element) {
    handle(element);
    for (const child of element.children) {
      handleTree(child);
    }
  }
  const $OBSERVED = Symbol();
  function isElement(node) {
    return node.nodeType === Node.ELEMENT_NODE;
  }
  const observer = new MutationObserver((mutations) => {
    for (const { target, addedNodes } of mutations) {
      if (!isElement(target) || target.nodeName === "HEAD")
        continue;
      for (const node of addedNodes) {
        if (!isElement(node))
          continue;
        if (!node[$OBSERVED]) {
          if (isFragment(node)) {
            handleTree(node);
          } else {
            handle(node);
          }
          node[$OBSERVED] = true;
        }
      }
    }
  });
  observer.observe(document, {
    subtree: true,
    childList: true
  });
  exports2.derived = derived;
  exports2.effect = effect;
  exports2.getVar = getVar;
  exports2.observer = observer;
  exports2.setVar = setVar;
  exports2.signal = signal;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
