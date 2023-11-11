import { tags, text } from "gotei";
import { type Gotei } from "gotei/runtime";

interface CounterProps extends Gotei.Attrs<"button"> {
  count: () => number;
}

export default function ({ count, ...props }: CounterProps) {
  return tags.button(props, "Count is: ", text(count));
}
