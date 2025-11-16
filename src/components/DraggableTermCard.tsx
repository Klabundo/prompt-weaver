import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, GripVertical } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface Term {
  text: string;
  image?: string;
}

interface DraggableTermCardProps {
  term: Term;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  isDragEnabled?: boolean;
}

export const DraggableTermCard = ({
  term,
  isSelected,
  onSelect,
  onDelete,
  isDragEnabled = false,
}: DraggableTermCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: term.text,
    disabled: !isDragEnabled,
    data: { term },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-glow ${
        isSelected
          ? "ring-2 ring-primary shadow-glow scale-105"
          : "hover:scale-102"
      } ${isDragging ? "z-50" : ""}`}
    >
      {term.image ? (
        <div className="aspect-square relative">
          <img
            src={term.image}
            alt={term.text}
            className="w-full h-full object-cover"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl">
                ✓
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-square bg-muted flex items-center justify-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          {isDragEnabled && (
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <Badge
            variant={isSelected ? "default" : "secondary"}
            className="flex-1 justify-center truncate text-sm py-1"
          >
            {term.text}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
