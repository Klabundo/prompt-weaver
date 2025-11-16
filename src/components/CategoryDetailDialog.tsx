import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { AddTermDialog } from "./AddTermDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface Term {
  text: string;
  image?: string;
}

interface CategoryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: {
    id: string;
    name: string;
    terms: Term[];
  };
  onAddTerm: (categoryId: string, term: string, image?: string) => void;
  onRemoveTerm: (categoryId: string, term: string) => void;
  onSelectTerm: (term: string) => void;
  selectedTerms: string[];
}

export const CategoryDetailDialog = ({
  open,
  onOpenChange,
  category,
  onAddTerm,
  onRemoveTerm,
  onSelectTerm,
  selectedTerms,
}: CategoryDetailDialogProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    term?: string;
  }>({ open: false });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">{category.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {category.terms.length} Begriff{category.terms.length !== 1 ? "e" : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
            {category.terms.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Noch keine Begriffe vorhanden</p>
                <p className="text-sm mt-2">Klicke unten auf "Begriff hinzufügen"</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
                {category.terms.map((term) => {
                  const isSelected = selectedTerms.includes(term.text);
                  return (
                    <Card
                      key={term.text}
                      onClick={() => onSelectTerm(term.text)}
                      className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-glow ${
                        isSelected
                          ? "ring-2 ring-primary shadow-glow scale-105"
                          : "hover:scale-102"
                      }`}
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
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                ✓
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="aspect-square bg-muted flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      
                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            variant={isSelected ? "default" : "secondary"}
                            className="flex-1 justify-center truncate"
                          >
                            {term.text}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteDialog({ open: true, term: term.text });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="w-full bg-gradient-primary text-white shadow-glow hover:shadow-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Begriff hinzufügen
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddTermDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={(term, image) => {
          onAddTerm(category.id, term, image);
          setShowAddDialog(false);
        }}
      />

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={() => {
          if (deleteDialog.term) {
            onRemoveTerm(category.id, deleteDialog.term);
          }
          setDeleteDialog({ open: false });
        }}
        title="Begriff löschen?"
        description={`Möchtest du den Begriff "${deleteDialog.term}" wirklich löschen?`}
      />
    </>
  );
};
