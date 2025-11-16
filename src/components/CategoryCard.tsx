import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { TermWithImage } from "./TermWithImage";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { AddTermDialog } from "./AddTermDialog";

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
  onAddTerm: (categoryId: string, term: string, image?: string) => void;
  onRemoveTerm: (categoryId: string, term: string) => void;
  onDeleteCategory: (categoryId: string) => void;
  onSelectTerm: (term: string) => void;
  selectedTerms: string[];
}

export const CategoryCard = ({
  category,
  onAddTerm,
  onRemoveTerm,
  onDeleteCategory,
  onSelectTerm,
  selectedTerms,
}: CategoryCardProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "category" | "term";
    item?: string;
  }>({ open: false, type: "category" });

  const handleConfirmDelete = () => {
    if (deleteDialog.type === "category") {
      onDeleteCategory(category.id);
    } else if (deleteDialog.type === "term" && deleteDialog.item) {
      onRemoveTerm(category.id, deleteDialog.item);
    }
    setDeleteDialog({ open: false, type: "category" });
  };

  return (
    <>
      <Card className="p-6 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 animate-scale-in border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteDialog({ open: true, type: "category" })}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[2.5rem]">
          {category.terms.map((term) => (
            <TermWithImage
              key={term.text}
              term={term.text}
              image={term.image}
              isSelected={selectedTerms.includes(term.text)}
              onSelect={() => onSelectTerm(term.text)}
              onRemove={() =>
                setDeleteDialog({ open: true, type: "term", item: term.text })
              }
            />
          ))}
        </div>

        <Button
          onClick={() => setShowAddDialog(true)}
          variant="outline"
          size="sm"
          className="w-full border-dashed border-border hover:border-primary hover:bg-secondary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Begriff hinzufügen
        </Button>
      </Card>

      <AddTermDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={(term, image) => onAddTerm(category.id, term, image)}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleConfirmDelete}
        title={
          deleteDialog.type === "category"
            ? "Kategorie löschen?"
            : "Begriff löschen?"
        }
        description={
          deleteDialog.type === "category"
            ? `Möchtest du die Kategorie "${category.name}" wirklich löschen? Alle Begriffe gehen verloren.`
            : `Möchtest du den Begriff "${deleteDialog.item}" wirklich löschen?`
        }
      />
    </>
  );
};
