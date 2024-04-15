import { PropsWithChildren, memo } from 'preact/compat';
import { useDndContext } from '../dnd-context';

export const DndDroppable = memo<PropsWithChildren>(({ children }) => {
	const { onSetDroppableRef } = useDndContext();

	return <div ref={onSetDroppableRef}>{children}</div>;
});
