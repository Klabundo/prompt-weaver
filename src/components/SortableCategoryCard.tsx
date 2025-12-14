import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CategoryCard } from "./CategoryCard";

interface SortableCategoryCardProps {
    category: any; // Type matches your existing interfaces
    onDeleteCategory: (id: string) => void;
    onOpenCategory: (id: string) => void;
}

export const SortableCategoryCard = (props: SortableCategoryCardProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: props.category.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <CategoryCard {...props} />
        </div>
    );
};
