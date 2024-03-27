import { Nullable } from '@/types/utils';
import { Coords } from '@/types/common';
import { getPointerEventData } from './utils';

export type NullableHTMLDivElement = Nullable<HTMLDivElement>;

export type DndOptions = {
	droppableElement: NullableHTMLDivElement;
};

type PointerEventData = ReturnType<typeof getPointerEventData>;

export type DragEventHandlerWithData = (data: PointerEventData) => void;
export type OnDragEndHandler = (
	data: PointerEventData,
	callbacks: {
		setInitialOffset: VoidFunction;
		updateOffset: (offset: Coords, callback?: VoidFunction) => void;
	},
) => void;

export type DndContextOptionsType = DndOptions & {
	onDragStart: DragEventHandlerWithData;
	onDragMove: DragEventHandlerWithData;
	onDragEnd: OnDragEndHandler;
	onSetDroppableRef: (node: NullableHTMLDivElement) => void;
};
