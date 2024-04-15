import { CSSProperties, PropsWithChildren, useEffect, useState } from 'preact/compat';
import { observer } from 'mobx-react-lite';
import cx from 'classnames';

import { Coords } from '@/types/common';
import { useDndContext } from '../dnd-context';
import { getDraggableStyles, getPointerEventData } from '../utils';
import { INITIAL_COORDS } from '../constants';

import styles from './styles.module.css';

type Props = {
	containerDataProps?: Record<string, string>;
	extendDraggableStyles?: (styles: CSSProperties) => CSSProperties;
	className?: string;
};

export const DndDraggable = observer<PropsWithChildren<Props>>(
	({ children, containerDataProps = {}, extendDraggableStyles, className }) => {
		const { onDragStart, onDragMove, onDragEnd, droppableElement } = useDndContext();
		const [isDragStarted, setIsDragStarted] = useState(false);
		const [startDragPosition, setStartDragPosition] = useState(INITIAL_COORDS);
		const [offset, setOffset] = useState(INITIAL_COORDS);
		const [style, setStyle] = useState<CSSProperties>({});
		const [withTransition, setWithTransition] = useState(false);

		useEffect(() => {
			let resultStyle = getDraggableStyles(offset);

			if (extendDraggableStyles) {
				resultStyle = extendDraggableStyles(resultStyle);
			}

			setStyle(resultStyle);
		}, [extendDraggableStyles, offset]);

		const toggleTransition = (callback?: VoidFunction) => {
			setWithTransition(true);
			setTimeout(() => {
				setWithTransition(false);
				callback?.();
			}, 300);
		};

		const updateOffset = (offsetDiff: Coords, callback?: VoidFunction) => {
			toggleTransition(callback);
			setOffset({ x: offset.x - offsetDiff.x, y: offset.y - offsetDiff.y });
		};

		const setInitialOffset = () => {
			toggleTransition();
			setStartDragPosition(INITIAL_COORDS);
			setOffset(INITIAL_COORDS);
		};

		const handlePointerDown = (event: PointerEvent) => {
			onDragStart(getPointerEventData(event, droppableElement));
			setIsDragStarted(true);
			setStartDragPosition({ x: event.clientX, y: event.clientY });
		};

		const handlePointerMove = (event: PointerEvent) => {
			if (isDragStarted) {
				onDragMove(getPointerEventData(event, droppableElement));
				setOffset({
					x: event.clientX - startDragPosition.x,
					y: event.clientY - startDragPosition.y,
				});
			}
		};

		const handlePointerUp = (event: PointerEvent) => {
			onDragEnd(getPointerEventData(event, droppableElement), {
				updateOffset,
				setInitialOffset,
			});
			setIsDragStarted(false);
		};

		return (
			<div
				{...containerDataProps}
				onDragStart={undefined}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				className={cx(styles.dndDraggable, className, {
					[styles.withTransition]: withTransition,
				})}
				style={style}
			>
				{children}
			</div>
		);
	},
);
