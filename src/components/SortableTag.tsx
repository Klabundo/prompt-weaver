import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface SortableTagProps {
  id: string;
  text: string;
  onRemove: (text: string) => void;
  onUpdate: (newText: string) => void;
}

export const SortableTag = ({ id, text, onRemove, onUpdate }: SortableTagProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const [weight, setWeight] = useState(1);

  useEffect(() => {
    const match = text.match(/^\((.*):([0-9.]+)\)$/);
    if (match) {
      setWeight(parseFloat(match[2]));
    } else {
      setWeight(1);
    }
  }, [text]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "grab",
  };

  const handleWeightChange = (delta: number) => {
    const match = text.match(/^\((.*):([0-9.]+)\)$/);
    let baseText = text;
    let currentWeight = 1;

    if (match) {
      baseText = match[1];
      currentWeight = parseFloat(match[2]);
    }

    let newWeight = parseFloat((currentWeight + delta).toFixed(1));
    if (newWeight <= 0) newWeight = 0.1;

    let newText = baseText;
    if (newWeight !== 1) {
      newText = `(${baseText}:${newWeight})`;
    }

    onUpdate(newText);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="inline-block m-1 group">
      <Badge
        variant="secondary"
        className="text-sm py-1 pl-2 pr-1 gap-1 hover:bg-secondary/80 bg-background border border-border flex items-center"
      >
        <div className="flex flex-col -ml-1 mr-1 opacity-0 group-hover:opacity-100 transition-opacity scale-75">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWeightChange(0.1);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="h-3 w-3 flex items-center justify-center hover:bg-muted rounded text-[8px]"
          >
            +
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleWeightChange(-0.1);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="h-3 w-3 flex items-center justify-center hover:bg-muted rounded text-[8px]"
          >
            -
          </button>
        </div>
        <span className={weight !== 1 ? "text-primary font-medium" : ""}>{text}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(text);
          }}
          className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors ml-1"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    </div>
  );
};
