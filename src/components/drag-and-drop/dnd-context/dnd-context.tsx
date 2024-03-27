import {
	FunctionComponent,
	PropsWithChildren,
	createContext,
	memo,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'preact/compat';
import cx from 'classnames';

import { DEFAULT_DND_CONTEXT_OPTIONS, DEFAULT_DND_OPTIONS } from '../constants';
import {
	DndContextOptionsType,
	DndOptions,
	DragCallbackWithData,
	OnDragEndCallback,
} from '../types';

import styles from './styles.module.css';

type Props = {
	onDragStart?: DragCallbackWithData;
	onDragMove?: DragCallbackWithData;
	onDragEnd?: OnDragEndCallback;
	className?: string;
};

const DndContext = createContext<DndContextOptionsType>(DEFAULT_DND_CONTEXT_OPTIONS);
const useDndContext = () => useContext(DndContext);

const DndProvider: FunctionComponent<PropsWithChildren<Props>> = memo(({ children, ...props }) => {
	const [dndOptions, changeDndOptions] = useState(DEFAULT_DND_OPTIONS);

	const { onDragStart, onDragMove, onDragEnd, className } = props;

	const handleChangeDndOptions = useCallback(
		(options: Partial<DndOptions>) => {
			changeDndOptions((prevOptions) => ({
				...prevOptions,
				...options,
			}));
		},
		[changeDndOptions],
	);

	const handleSetDroppableRef: DndContextOptionsType['onSetDroppableRef'] = useCallback(
		(node) => {
			handleChangeDndOptions({ droppableElement: node });
		},
		[handleChangeDndOptions],
	);

	const handleDragStart: DndContextOptionsType['onDragStart'] = useCallback(
		(data) => {
			onDragStart?.(data);
			data.draggableElement?.setPointerCapture(data.pointerId);
		},
		[onDragStart],
	);

	const handleDragMove: DndContextOptionsType['onDragMove'] = useCallback(
		(data) => {
			onDragMove?.(data);
		},
		[onDragMove],
	);

	const handleDragEnd: DndContextOptionsType['onDragEnd'] = useCallback(
		(data, updateOffset) => {
			onDragEnd?.(data, updateOffset);
		},
		[onDragEnd],
	);

	const dndContextValue: DndContextOptionsType = useMemo(
		() => ({
			...dndOptions,
			onDragStart: handleDragStart,
			onDragMove: handleDragMove,
			onDragEnd: handleDragEnd,
			onSetDroppableRef: handleSetDroppableRef,
		}),
		[dndOptions, handleDragStart, handleDragMove, handleDragEnd, handleSetDroppableRef],
	);

	return (
		<DndContext.Provider value={dndContextValue}>
			<div className={cx(styles.dndContext, className)}>{children}</div>
		</DndContext.Provider>
	);
});

export { useDndContext, DndProvider };
