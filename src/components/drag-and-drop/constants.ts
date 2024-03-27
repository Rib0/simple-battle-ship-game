import { DndContextOptionsType, DndOptions } from './types';

export const DEFAULT_DND_OPTIONS: DndOptions = {
	droppableElement: null,
};

export const DEFAULT_DND_CONTEXT_OPTIONS: DndContextOptionsType = {
	...DEFAULT_DND_OPTIONS,
	onDragStart: () => {},
	onDragMove: () => {},
	onDragEnd: () => {},
	onSetDroppableRef: () => {},
};

export const INITIAL_COORDS = { x: 0, y: 0 };
