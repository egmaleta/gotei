import { tags, text } from "gotei";
import { type Gotei } from "gotei/runtime";
import { type Signal } from "gotei/state";

type ButtonProps = Gotei.IntrinsicElements["button"];

interface CounterProps extends ButtonProps {
	count: Signal<number>;
}

export default function ({ count, ...props }: CounterProps) {
	return tags.button(props, "Count is: ", text(count));
}
