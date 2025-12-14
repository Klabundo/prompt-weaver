import { SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

// Helper component to provide the droppable context
export const DroppableArea = ({ children, id }: { children: React.ReactNode; id: string }) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="flex flex-wrap items-center min-h-[50px]">
            {children}
        </div>
    );
};
