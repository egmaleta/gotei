import { tags, text } from "gotei";
import type { Gotei } from "gotei/runtime";
import { signal } from "gotei/state";

interface ButtonProps extends Gotei.Attrs<"button"> {
  start: number;
}

const { button } = tags;

export default function (props: ButtonProps = { start: 0 }) {
  const { start, ...rest } = props;
  const count = signal(start);

  return button(
    {
      ...rest,
      onclick: () => count.set((c) => c + 1),
    },
    "Clicked ",
    text(count),
    " times"
  );
}
