import { Gotei } from "gotei/runtime";
import type { SignalGetter, SignalSetter } from "gotei/state";

type ButtonProps = Gotei.IntrinsicElements["button"];

interface CounterProps extends ButtonProps {
	count: SignalGetter<number> & SignalSetter<number>;
}

export default function ({ count, ...rest }: CounterProps) {
	const increaseCount = () => count.map((c) => c + 1);

	return (
		<button {...rest} onclick={increaseCount} type="button">
			Count: <span text={count} />
		</button>
	);
}
