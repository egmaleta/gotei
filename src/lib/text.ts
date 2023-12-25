import { Gotei } from "./ns";
import { effect } from "./state";
import { OrArray, OrComputed, flatten } from "./utils";

class TextVNode implements Gotei.VNode<Text> {
  constructor(private children: OrComputed<string | number | boolean>[]) {}

  render() {
    const text = document.createTextNode("");

    for (const child of this.children) {
      const chText = document.createTextNode("");

      if (typeof child !== "function") {
        chText.data = `${child}`;
      } else {
        effect(() => (chText.data = `${child()}`));
      }

      text.appendChild(chText);
    }

    return text;
  }
}

export function text(
  ...data: OrArray<OrComputed<string | number | boolean>>[]
) {
  return new TextVNode(flatten(data));
}
