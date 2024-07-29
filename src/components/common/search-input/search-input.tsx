import { JSX } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import { Button, Input, Space } from 'antd';
import { SendOutlined, DeleteOutlined } from '@ant-design/icons';

import { useClipboard } from '@/hooks/use-clipboard';

import styles from './styles.module.css';

type Props = {
	onChange: (value: string) => void;
	value: string;
};

export const SearchInput = observer<Props>(({ onChange, value }) => {
	const { isAvailable, readText } = useClipboard();

	const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>) => {
		if (!(e?.target instanceof HTMLInputElement)) {
			return;
		}

		const { value: targetValue } = e.target;

		onChange(targetValue);
	};

	const handleClear = () => {
		onChange('');
	};

	const handlePastText = async () => {
		const text = await readText();

		if (text) {
			onChange(text);
		}
	};

	return (
		<Space.Compact>
			<Button
				disabled={!value}
				size="small"
				onClick={handleClear}
				icon={<DeleteOutlined />}
			/>
			<Input
				onChange={handleChange}
				value={value}
				rootClassName={styles.input}
				placeholder="Пригласить по id"
				size="small"
			/>
			{isAvailable && (
				<Button
					type="primary"
					size="small"
					onClick={handlePastText}
					icon={<SendOutlined />}
				/>
			)}
		</Space.Compact>
	);
});
