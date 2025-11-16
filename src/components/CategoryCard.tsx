import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, ChevronRight, Folder } from "lucide-react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface Term {
  text: string;
  image?: string;
}

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    terms: Term[];
  };
  onDeleteCategory: (categoryId: string) => void;
  onOpenCategory: (categoryId: string) => void;
}

export const CategoryCard = ({
  category,
  onDeleteCategory,
  onOpenCategory,
}: CategoryCardProps) => {
  const [deleteDialog, setDeleteDialog] = useState(false);

  const termsWithImages = category.terms.filter(t => t.image).length;

  return (
    <>
      <Card 
        className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 animate-scale-in border-border/50 cursor-pointer group"
        onClick={() => onOpenCategory(category.id)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Folder className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.terms.length} Begriff{category.terms.length !== 1 ? "e" : ""}
                {termsWithImages > 0 && ` • ${termsWithImages} mit Bild`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteDialog(true);
              }}
              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-500"
            style={{ 
              width: category.terms.length > 0 ? `${Math.min(100, (category.terms.length / 20) * 100)}%` : '0%' 
            }}
          />
        </div>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialog}
        onOpenChange={setDeleteDialog}
        onConfirm={() => {
          onDeleteCategory(category.id);
          setDeleteDialog(false);
        }}
        title="Kategorie löschen?"
        description={`Möchtest du die Kategorie "${category.name}" wirklich löschen? Alle Begriffe gehen verloren.`}
      />
    </>
  );
};
