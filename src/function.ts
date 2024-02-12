import { derived, signal } from "./state";
import { getNamedVars } from "./store";

const TRACKED_PATTERN = /\$(\w+)/g;
const UNTRACKED_PATTERN = /&(\w+)/g;

function normalizeCode(code: string) {
  return code
    .replace(TRACKED_PATTERN, (_, name) => `${name}.v`)
    .replace(UNTRACKED_PATTERN, (_, name) => `${name}.uv`);
}

function createFunction(
  element: Element,
  code: string,
  params: string[] = [],
  args: any[] = [],
) {
  const body = `"use strict"; ${normalizeCode(code)}`;

  const namedVars = getNamedVars(element);
  params = namedVars.map(([name, _]) => name).concat(params);
  args = namedVars.map(([_, v]) => v).concat(args);

  return new Function(...params, body).bind(element, ...args);
}

function createSignal(element: Element, expr: string) {
  const f = createFunction(element, `return ${expr};`);
  return signal(f());
}

function createDerivedSignal(element: Element, expr: string) {
  const f = createFunction(element, `return ${expr};`);
  return derived(f);
}

function createComputation(element: Element, expr: string) {
  const f = createFunction(element, `return ${expr};`);

  if (TRACKED_PATTERN.test(expr)) {
    return derived(f);
  }
  return f;
}

export { createFunction, createSignal, createDerivedSignal, createComputation };
