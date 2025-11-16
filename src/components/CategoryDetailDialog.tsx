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
import { Plus, X, Image as ImageIcon, FolderPlus } from "lucide-react";
import { AddTermDialog } from "./AddTermDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Term {
  text: string;
  image?: string;
}

interface Subcategory {
  id: string;
  name: string;
  terms: Term[];
}

interface CategoryDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: {
    id: string;
    name: string;
    terms: Term[];
    subcategories?: Subcategory[];
  };
  onAddTerm: (categoryId: string, term: string, image?: string) => void;
  onRemoveTerm: (categoryId: string, term: string) => void;
  onSelectTerm: (term: string) => void;
  selectedTerms: string[];
  onAddSubcategory?: (categoryId: string, name: string) => void;
  onDeleteSubcategory?: (categoryId: string, subcategoryId: string) => void;
  onAddTermToSubcategory?: (categoryId: string, subcategoryId: string, term: string, image?: string) => void;
  onRemoveTermFromSubcategory?: (categoryId: string, subcategoryId: string, term: string) => void;
}

export const CategoryDetailDialog = ({
  open,
  onOpenChange,
  category,
  onAddTerm,
  onRemoveTerm,
  onSelectTerm,
  selectedTerms,
  onAddSubcategory,
  onDeleteSubcategory,
  onAddTermToSubcategory,
  onRemoveTermFromSubcategory,
}: CategoryDetailDialogProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddSubcategoryDialog, setShowAddSubcategoryDialog] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    term?: string;
    subcategoryId?: string;
  }>({ open: false });

  const handleAddSubcategory = () => {
    if (newSubcategoryName.trim() && onAddSubcategory) {
      onAddSubcategory(category.id, newSubcategoryName.trim());
      setNewSubcategoryName("");
      setShowAddSubcategoryDialog(false);
    }
  };

  const renderTermsGrid = (terms: Term[], subcategoryId?: string) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
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
                    setDeleteDialog({ open: true, term: term.text, subcategoryId });
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
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">{category.name}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {category.terms.length} direkte Begriff{category.terms.length !== 1 ? "e" : ""}
              {category.subcategories && category.subcategories.length > 0 && 
                ` • ${category.subcategories.length} Unterkategorie${category.subcategories.length !== 1 ? "n" : ""}`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
            {category.subcategories && category.subcategories.length > 0 ? (
              <Tabs defaultValue="main" className="w-full">
                <div className="flex items-center justify-between mb-4">
                  <TabsList className="bg-muted">
                    <TabsTrigger value="main">Hauptkategorie</TabsTrigger>
                    {category.subcategories.map((sub) => (
                      <TabsTrigger key={sub.id} value={sub.id}>
                        {sub.name} ({sub.terms.length})
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {onAddSubcategory && (
                    <Button
                      onClick={() => setShowAddSubcategoryDialog(true)}
                      variant="outline"
                      size="sm"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      Unterkategorie
                    </Button>
                  )}
                </div>

                <TabsContent value="main">
                  {category.terms.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">Noch keine Begriffe vorhanden</p>
                    </div>
                  ) : (
                    renderTermsGrid(category.terms)
                  )}
                </TabsContent>

                {category.subcategories.map((sub) => (
                  <TabsContent key={sub.id} value={sub.id}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{sub.name}</h3>
                      {onDeleteSubcategory && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteDialog({ open: true, subcategoryId: sub.id })}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Unterkategorie löschen
                        </Button>
                      )}
                    </div>
                    {sub.terms.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Noch keine Begriffe vorhanden</p>
                      </div>
                    ) : (
                      renderTermsGrid(sub.terms, sub.id)
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <>
                {category.terms.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Noch keine Begriffe vorhanden</p>
                    <p className="text-sm mt-2">Klicke unten auf "Begriff hinzufügen"</p>
                  </div>
                ) : (
                  renderTermsGrid(category.terms)
                )}
              </>
            )}
          </div>

          <div className="border-t border-border pt-4 mt-4 flex gap-2">
            {onAddSubcategory && (!category.subcategories || category.subcategories.length === 0) && (
              <Button
                onClick={() => setShowAddSubcategoryDialog(true)}
                variant="outline"
                className="flex-1"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Unterkategorie erstellen
              </Button>
            )}
            <Button
              onClick={() => setShowAddDialog(true)}
              className="flex-1 bg-gradient-primary text-white shadow-glow hover:shadow-lg"
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
          if (activeSubcategoryId && onAddTermToSubcategory) {
            onAddTermToSubcategory(category.id, activeSubcategoryId, term, image);
          } else {
            onAddTerm(category.id, term, image);
          }
          setShowAddDialog(false);
        }}
      />

      {showAddSubcategoryDialog && (
        <Dialog open={showAddSubcategoryDialog} onOpenChange={setShowAddSubcategoryDialog}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Unterkategorie erstellen</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Erstelle eine Unterkategorie in "{category.name}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSubcategory()}
                placeholder="Name der Unterkategorie..."
                className="border-border"
                autoFocus
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddSubcategoryDialog(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleAddSubcategory} disabled={!newSubcategoryName.trim()}>
                Erstellen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={() => {
          if (deleteDialog.subcategoryId && onDeleteSubcategory) {
            onDeleteSubcategory(category.id, deleteDialog.subcategoryId);
          } else if (deleteDialog.term) {
            if (deleteDialog.subcategoryId && onRemoveTermFromSubcategory) {
              onRemoveTermFromSubcategory(category.id, deleteDialog.subcategoryId, deleteDialog.term);
            } else {
              onRemoveTerm(category.id, deleteDialog.term);
            }
          }
          setDeleteDialog({ open: false });
        }}
        title={deleteDialog.subcategoryId && !deleteDialog.term ? "Unterkategorie löschen?" : "Begriff löschen?"}
        description={
          deleteDialog.subcategoryId && !deleteDialog.term
            ? "Möchtest du diese Unterkategorie wirklich löschen? Alle Begriffe gehen verloren."
            : `Möchtest du den Begriff "${deleteDialog.term}" wirklich löschen?`
        }
      />
    </>
  );
};
