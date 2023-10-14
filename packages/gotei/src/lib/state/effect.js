import { define } from "./oop";
import { CONTEXT } from "./context";

export function Effect(callback, isUIEffect) {
  this.callback = callback;
  this.isUIEffect = isUIEffect;
  this.update();
}

define(Effect, {
  update(ctx) {
    CONTEXT.push(this);
    this.callback();
    CONTEXT.pop();
  },
});
