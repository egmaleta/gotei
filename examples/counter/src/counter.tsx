import { Gotei } from "gotei/runtime";
import { effect, signal } from "gotei/state";

type ButtonProps = Gotei.IntrinsicElements["button"];

interface CounterProps extends ButtonProps {
	initialCount?: number;
}

export default function ({ initialCount = 0, ...rest }: CounterProps) {
	const count = signal(initialCount);
	const increaseCount = () => count.map((c) => c + 1);

	effect(() => console.log(count()));

	return (
		<button {...rest} onclick={increaseCount} type="button">
			Count: <span text={count} />
		</button>
	);
}
