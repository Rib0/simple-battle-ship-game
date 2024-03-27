import { CSSProperties } from 'preact/compat';

import { Coords } from '@/types/common';
import { NullableHTMLDivElement } from './types';

export const getDraggableStyles = ({ x, y }: Coords): CSSProperties => ({
	transform: `translate(${x}px, ${y}px)`,
});

export const getPointerEventData = (
	event: PointerEvent,
	droppableElement: NullableHTMLDivElement,
) => {
	const { pointerId, clientX, clientY } = event;

	return {
		pointerId,
		clientX,
		clientY,
		draggableElement: event.currentTarget as HTMLDivElement,
		droppableElement,
	};
};
