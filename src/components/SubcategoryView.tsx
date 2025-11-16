import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface Term {
  text: string;
  image?: string;
}

interface SubcategoryViewProps {
  subcategoryName: string;
  terms: Term[];
  selectedTerms: string[];
  onSelectTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
  onBack: () => void;
}

export const SubcategoryView = ({
  subcategoryName,
  terms,
  selectedTerms,
  onSelectTerm,
  onRemoveTerm,
  onBack,
}: SubcategoryViewProps) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    term?: string;
  }>({ open: false });

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">{subcategoryName}</h2>
            <p className="text-muted-foreground mt-1">
              {terms.length} Begriff{terms.length !== 1 ? "e" : ""}
            </p>
          </div>
          <Button onClick={onBack} variant="outline" size="lg">
            ← Zurück
          </Button>
        </div>

        {terms.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-20 w-20 mx-auto mb-6 opacity-30" />
            <p className="text-xl">Noch keine Begriffe vorhanden</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {terms.map((term) => {
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

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={() => {
          if (deleteDialog.term) {
            onRemoveTerm(deleteDialog.term);
          }
          setDeleteDialog({ open: false });
        }}
        title="Begriff löschen?"
        description={`Möchtest du den Begriff "${deleteDialog.term}" wirklich löschen?`}
      />
    </>
  );
};
