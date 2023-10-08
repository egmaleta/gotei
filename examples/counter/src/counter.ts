import { tags, text } from "gotei";
import { type Gotei } from "gotei/runtime";
import { type SignalGetter } from "gotei/state";

interface CounterProps extends Gotei.Attrs<"button"> {
	count: SignalGetter<number>;
}

export default function ({ count, ...props }: CounterProps) {
	return tags.button(props, "Count is: ", text(count));
}
