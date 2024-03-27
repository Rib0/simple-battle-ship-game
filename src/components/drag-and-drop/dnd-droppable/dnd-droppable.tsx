import { FunctionComponent } from 'preact';
import { PropsWithChildren, memo } from 'preact/compat';
import { useDndContext } from '../dnd-context';

export const DndDroppable: FunctionComponent<PropsWithChildren> = memo(({ children }) => {
	const { onSetDroppableRef } = useDndContext();

	return <div ref={onSetDroppableRef}>{children}</div>;
});
