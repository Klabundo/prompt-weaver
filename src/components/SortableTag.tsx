import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SortableTagProps {
  id: string;
  text: string;
  onRemove: (text: string) => void;
}

export const SortableTag = ({ id, text, onRemove }: SortableTagProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="inline-block m-1">
      <Badge
        variant="secondary"
        className="text-sm py-1 pl-3 pr-1 gap-2 hover:bg-secondary/80 bg-background border border-border"
      >
        <span>{text}</span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent drag start
            onRemove(text);
          }}
          className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
          onMarkdown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()} // Critical for dnd-kit
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    </div>
  );
};
