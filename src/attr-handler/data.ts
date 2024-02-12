import { effect } from "..";
import { createComputation, createSignal } from "../function";
import { setVar } from "../store";
import { attr } from "./attr";

const DATA_ATTR_PREFIX = attr("data-");

function getItem(storage: Storage, key: string, as: string) {
  const value = storage.getItem(key);

  if (value !== null) {
    switch (as) {
      case "string":
        return value;
      case "number":
        return Number.parseFloat(value);
      case "boolean":
        return value === "true";
    }
  }
}

function handle(element: HTMLElement, attrSuffix: string, expr: string) {
  const names = attrSuffix.split("-");

  const name = names[names.length - 1];

  let option: "rx" | "local" | "session" | null = null;
  if (names.length > 1) {
    const opt = names[0];
    if (opt === "rx" || opt === "local" || opt === "session") {
      option = opt;
    }
  }

  if (option === "rx") {
    const comp = createComputation(element, expr);
    setVar(element, name, "v" in comp ? comp : comp());
    return;
  }

  const s = createSignal(element, expr);
  setVar(element, name, s);

  if (option !== null) {
    const storage = option === "local" ? localStorage : sessionStorage;

    const value = getItem(storage, name, typeof s.uv);
    if (typeof value !== "undefined") {
      s.v = value;
      effect(() => storage.setItem(name, s.v));
    }
  }
}

export { handle, DATA_ATTR_PREFIX };
