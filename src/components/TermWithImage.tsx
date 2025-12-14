import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TermWithImageProps {
  term: string;
  image?: string;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export const TermWithImage = ({
  term,
  image,
  isSelected,
  onSelect,
  onRemove,
}: TermWithImageProps) => {
  return (
    <div className="group relative">
      {image && (
        <div className="absolute -top-16 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
          <img
            src={image}
            alt={term}
            className="w-32 h-32 object-cover rounded-lg shadow-glow border-2 border-primary/30"
          />
        </div>
      )}
      <Badge
        variant={isSelected ? "default" : "secondary"}
        className={`cursor-pointer transition-all duration-200 ${
          isSelected
            ? "bg-primary text-primary-foreground shadow-glow scale-105"
            : "hover:bg-secondary/80"
        }`}
        onClick={onSelect}
      >
        {image && <span className="mr-1.5">🖼️</span>}
        {term}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1.5 hover:text-destructive"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    </div>
  );
};
