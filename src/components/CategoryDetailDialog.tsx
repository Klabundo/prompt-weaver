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
import { Plus, X, Image as ImageIcon, FolderPlus, Folder } from "lucide-react";
import { AddTermDialog } from "./AddTermDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Input } from "@/components/ui/input";
import { SubcategoryView } from "./SubcategoryView";

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
  const [activeSubcategory, setActiveSubcategory] = useState<Subcategory | null>(null);
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

  const renderMainContent = () => {
    // If viewing a subcategory
    if (activeSubcategory) {
      return (
        <SubcategoryView
          subcategoryName={activeSubcategory.name}
          terms={activeSubcategory.terms}
          selectedTerms={selectedTerms}
          onSelectTerm={onSelectTerm}
          onRemoveTerm={(term) => {
            if (onRemoveTermFromSubcategory) {
              onRemoveTermFromSubcategory(category.id, activeSubcategory.id, term);
            }
          }}
          onBack={() => setActiveSubcategory(null)}
        />
      );
    }

    // Main category view - show subcategories as large cards
    if (category.subcategories && category.subcategories.length > 0) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Unterkategorien</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {category.subcategories.map((sub) => {
                const imageCount = sub.terms.filter(t => t.image).length;
                return (
                  <Card
                    key={sub.id}
                    onClick={() => setActiveSubcategory(sub)}
                    className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-glow hover:scale-105"
                  >
                    <div className="aspect-square bg-gradient-card flex flex-col items-center justify-center p-6">
                      <Folder className="h-20 w-20 text-primary mb-4" />
                      <h4 className="font-semibold text-lg text-center">{sub.name}</h4>
                    </div>
                    <div className="p-4 border-t border-border">
                      <Badge variant="secondary" className="w-full justify-center">
                        {sub.terms.length} Begriff{sub.terms.length !== 1 ? "e" : ""}
                        {imageCount > 0 && ` • ${imageCount} 🖼️`}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Direct terms in main category */}
          {category.terms.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Direkte Begriffe</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            </div>
          )}
        </div>
      );
    }

    // No subcategories - show main category terms
    return (
      <div>
        {category.terms.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-20 w-20 mx-auto mb-6 opacity-30" />
            <p className="text-xl">Noch keine Begriffe vorhanden</p>
            <p className="text-sm mt-2">Klicke unten auf "Begriff hinzufügen"</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-3xl">
              {activeSubcategory ? activeSubcategory.name : category.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {!activeSubcategory && (
                <>
                  {category.terms.length} direkte Begriff{category.terms.length !== 1 ? "e" : ""}
                  {category.subcategories && category.subcategories.length > 0 && 
                    ` • ${category.subcategories.length} Unterkategorie${category.subcategories.length !== 1 ? "n" : ""}`
                  }
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1 py-4">
            {renderMainContent()}
          </div>

          {!activeSubcategory && (
            <div className="border-t border-border pt-4 mt-4 flex gap-2">
              {onAddSubcategory && (
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
          )}
        </DialogContent>
      </Dialog>

      <AddTermDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={(term, image) => {
          if (activeSubcategory && onAddTermToSubcategory) {
            onAddTermToSubcategory(category.id, activeSubcategory.id, term, image);
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
            if (activeSubcategory && onRemoveTermFromSubcategory) {
              onRemoveTermFromSubcategory(category.id, activeSubcategory.id, deleteDialog.term);
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
