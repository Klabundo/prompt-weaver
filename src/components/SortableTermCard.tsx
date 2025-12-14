import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DraggableTermCard } from "./DraggableTermCard";

interface SortableTermCardProps {
    id: string; // Add id for sortable
    term: any;
    isSelected?: boolean;
    onSelect?: () => void;
    onDelete: () => void;
    isDragEnabled?: boolean;
    onEdit?: () => void;
}

export const SortableTermCard = (props: SortableTermCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <DraggableTermCard
                {...props}
                isSelected={props.isSelected ?? false}
            />
        </div>
    );
};
