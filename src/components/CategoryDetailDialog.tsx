import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, FolderPlus, Image as ImageIcon } from "lucide-react";
import { AddTermDialog } from "./AddTermDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Input } from "@/components/ui/input";
import { SubcategoryView } from "./SubcategoryView";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { DraggableTermCard } from "./DraggableTermCard";
import { DroppableSubcategoryCard } from "./DroppableSubcategoryCard";
import { toast } from "sonner";

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
  const { t } = useTranslation();
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const draggedTerm = active.data.current?.term as Term;
    const targetSubcategoryId = over.id as string;

    if (draggedTerm && targetSubcategoryId && onAddTermToSubcategory) {
      // Add term to subcategory
      onAddTermToSubcategory(
        category.id,
        targetSubcategoryId,
        draggedTerm.text,
        draggedTerm.image
      );
      
      // Remove from main category
      onRemoveTerm(category.id, draggedTerm.text);
      
      toast.success(t('termAddedToSubcategory'));
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

    // Main category view - show subcategories as large cards with drag & drop
    if (category.subcategories && category.subcategories.length > 0) {
      return (
        <DndContext onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('subcategories')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {category.subcategories.map((sub) => (
                  <DroppableSubcategoryCard
                    key={sub.id}
                    subcategory={sub}
                    onClick={() => setActiveSubcategory(sub)}
                    onDelete={() =>
                      setDeleteDialog({ open: true, subcategoryId: sub.id })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Direct terms in main category with drag capability */}
            {category.terms.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  {t('terms')} <span className="text-sm text-muted-foreground">({t('dragToSubcategory')})</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.terms.map((term) => (
                    <DraggableTermCard
                      key={term.text}
                      term={term}
                      isSelected={selectedTerms.includes(term.text)}
                      onSelect={() => onSelectTerm(term.text)}
                      onDelete={() => setDeleteDialog({ open: true, term: term.text })}
                      isDragEnabled={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </DndContext>
      );
    }

    // No subcategories - show main category terms
    return (
      <div>
        {category.terms.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-20 w-20 mx-auto mb-6 opacity-30" />
            <p className="text-xl">{t('noTerms')}</p>
            <p className="text-sm mt-2">{t('addTermDescription')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.terms.map((term) => (
              <DraggableTermCard
                key={term.text}
                term={term}
                isSelected={selectedTerms.includes(term.text)}
                onSelect={() => onSelectTerm(term.text)}
                onDelete={() => setDeleteDialog({ open: true, term: term.text })}
                isDragEnabled={false}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl h-[90vh] bg-card border-border flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              {category.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {category.terms.length} {category.terms.length === 1 ? t('termCount') : t('termCountPlural')}
              {category.subcategories && category.subcategories.length > 0 && 
                ` • ${category.subcategories.length} ${category.subcategories.length === 1 ? t('subcategory') : t('subcategories')}`
              }
            </DialogDescription>
          </DialogHeader>

          {/* Action Buttons */}
          {!activeSubcategory && (
            <div className="flex gap-2 mb-4">
              <Button
                onClick={() => setShowAddDialog(true)}
                className="bg-gradient-primary text-white shadow-glow"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('addTerm')}
              </Button>
              
              {!showAddSubcategoryDialog && (
                <Button
                  onClick={() => setShowAddSubcategoryDialog(true)}
                  variant="outline"
                  className="border-border"
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  {t('createSubcategory')}
                </Button>
              )}
            </div>
          )}

          {/* Add Subcategory Input */}
          {showAddSubcategoryDialog && !activeSubcategory && (
            <div className="mb-4 flex gap-2">
              <Input
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder={t('categoryName')}
                className="border-border"
                onKeyPress={(e) => e.key === "Enter" && handleAddSubcategory()}
              />
              <Button onClick={handleAddSubcategory}>
                {t('add')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddSubcategoryDialog(false);
                  setNewSubcategoryName("");
                }}
              >
                {t('cancel')}
              </Button>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto pr-2">
            {renderMainContent()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Term Dialog */}
      <AddTermDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={(term, image) => {
          if (activeSubcategory && onAddTermToSubcategory) {
            onAddTermToSubcategory(category.id, activeSubcategory.id, term, image);
          } else {
            onAddTerm(category.id, term, image);
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={() => {
          if (deleteDialog.term) {
            if (activeSubcategory && onRemoveTermFromSubcategory) {
              onRemoveTermFromSubcategory(category.id, activeSubcategory.id, deleteDialog.term);
            } else {
              onRemoveTerm(category.id, deleteDialog.term);
            }
          } else if (deleteDialog.subcategoryId && onDeleteSubcategory) {
            onDeleteSubcategory(category.id, deleteDialog.subcategoryId);
          }
          setDeleteDialog({ open: false });
        }}
        title={
          deleteDialog.term
            ? t('deleteTermTitle')
            : t('deleteSubcategoryTitle')
        }
        description={
          deleteDialog.term
            ? `${t('deleteTermDescription')} "${deleteDialog.term}"?`
            : t('deleteSubcategoryDescription')
        }
      />
    </>
  );
};
