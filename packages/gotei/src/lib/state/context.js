import { define } from "./oop";

function Context() {
  this.stack = [];
}

define(Context, {
  push(obs) {
    this.stack.push(obs);
  },
  pop() {
    this.stack.pop();
  },
  current() {
    return this.stack.at(-1);
  },
  untrack(signalish) {
    const temp = this.stack;
    this.stack = [];
    const value = signalish();
    this.stack = temp;
    return value;
  },
});

export const CONTEXT = new Context();
