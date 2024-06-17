import { observer } from 'mobx-react-lite';

import { JSX } from 'preact/compat';
import styles from './styles.module.css';

type Props = {
	onChange: (value: string) => void;
	placeholder?: string;
};

export const Input = observer<Props>((props) => {
	const { onChange, placeholder } = props;

	const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
		if (!(e?.target instanceof HTMLInputElement)) {
			return;
		}

		const { value } = e.target;
		onChange(value);
	};

	return (
		<input
			onChange={handleChange}
			placeholder={placeholder}
			className={styles.input}
			type="text"
		/>
	);
});
