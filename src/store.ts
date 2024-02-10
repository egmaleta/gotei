type Store = Map<string, any>;

const $STORE = Symbol();

function setVar(element: Element, name: string, value: any) {
  let store: Store;
  if ($STORE in element) {
    // @ts-ignore
    store = element[$STORE];
  } else {
    store = new Map();
    // @ts-ignore
    element[$STORE] = store;
  }

  store.set(name, value);
}

function* ancestors(element: Element) {
  let p: Element | null = element;
  while (p !== null && p.tagName !== "HTML") {
    yield p;
    p = p.parentElement;
  }
}

function getNamedVars(element: Element) {
  const superStore: Store = new Map();

  for (const el of ancestors(element)) {
    if ($STORE in el) {
      const store = el[$STORE] as Store;
      for (const [key, value] of store.entries()) {
        if (!superStore.has(key)) {
          superStore.set(key, value);
        }
      }
    }
  }

  return [...superStore.entries()];
}

export { setVar, getNamedVars };
