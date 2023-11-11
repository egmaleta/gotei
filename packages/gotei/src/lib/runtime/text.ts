import { effect } from "../state";
import { OrComputed, MountFunction } from "./utils";

type TextRenderizable = string | number | boolean;

export function text<T extends TextRenderizable>(
  data: OrComputed<T>
): MountFunction<Text> {
  return (ctx) => {
    const text = ctx.document.createTextNode("");

    if (typeof data !== "function") {
      text.data = `${data}`;
    } else {
      effect(() => {
        text.data = `${data()}`;
      });
    }

    ctx.parent.appendChild(text);
    ctx.childIndex++;

    return text;
  };
}
