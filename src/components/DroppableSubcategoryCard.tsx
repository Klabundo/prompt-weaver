import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Trash2 } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";

interface DroppableSubcategoryCardProps {
  subcategory: {
    id: string;
    name: string;
    terms: any[];
  };
  onClick: () => void;
  onDelete: () => void;
}

export const DroppableSubcategoryCard = ({
  subcategory,
  onClick,
  onDelete,
}: DroppableSubcategoryCardProps) => {
  const { t } = useTranslation();
  const { isOver, setNodeRef } = useDroppable({
    id: subcategory.id,
    data: { subcategory },
  });

  return (
    <Card
      ref={setNodeRef}
      onClick={onClick}
      className={`group p-8 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer border-2 ${
        isOver ? "border-primary bg-primary/5 scale-105" : "border-border/50"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Folder className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {subcategory.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {subcategory.terms.length}{" "}
              {subcategory.terms.length === 1 ? t('termCount') : t('termCountPlural')}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="h-10 w-10 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {isOver && (
        <div className="mt-4 p-4 bg-primary/10 border-2 border-dashed border-primary rounded-lg text-center">
          <p className="text-primary font-medium">{t('dropHere')}</p>
        </div>
      )}
    </Card>
  );
};
