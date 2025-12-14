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
import { Plus, Image as ImageIcon } from "lucide-react";
import { AddTermDialog } from "./AddTermDialog";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Input } from "@/components/ui/input";
import { SubcategoryView } from "./SubcategoryView";
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { SortableTermCard } from "./SortableTermCard";
import { toast } from "sonner";
import { DraggableTermCard } from "./DraggableTermCard";
import { EditTermDialog } from "./EditTermDialog";

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
    subcategories?: never; // removed
  };
  onAddTerm: (categoryId: string, term: string, image?: string) => void;
  onRemoveTerm: (categoryId: string, term: string) => void;
  onSelectTerm: (term: string) => void;
  selectedTerms: string[];
  onRenameCategory?: (categoryId: string, newName: string) => void;
  onEditTerm?: (categoryId: string, oldText: string, newText: string, newImage?: string) => void;
  onReorderTerms?: (categoryId: string, oldIndex: number, newIndex: number) => void;
}

export const CategoryDetailDialog = ({
  open,
  onOpenChange,
  category,
  onAddTerm,
  onRemoveTerm,
  onSelectTerm,
  selectedTerms,
  onRenameCategory,
  onEditTerm,
  onReorderTerms,
}: CategoryDetailDialogProps) => {
  const { t } = useTranslation();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    term?: string;
  }>({ open: false });
  const [isRenaming, setIsRenaming] = useState(false);
  const [editedCategoryName, setEditedCategoryName] = useState(category.name);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editInitialText, setEditInitialText] = useState<string>("");
  const [editInitialImage, setEditInitialImage] = useState<string | undefined>(undefined);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id && onReorderTerms) {
      const oldIndex = category.terms.findIndex((t) => t.text === active.id);
      const newIndex = category.terms.findIndex((t) => t.text === over?.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorderTerms(category.id, oldIndex, newIndex);
      }
    }
  };

  const renderMainContent = () => {
    return (
      <div>
        {category.terms.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-20 w-20 mx-auto mb-6 opacity-30" />
            <p className="text-xl">{t('noTerms')}</p>
            <p className="text-sm mt-2">{t('addTermDescription')}</p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={useSensors(
              useSensor(PointerSensor, {
                activationConstraint: {
                  distance: 8,
                },
              })
            )}
          >
            <SortableContext items={category.terms.map(t => t.text)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.terms.map((term) => (
                  <SortableTermCard
                    key={term.text}
                    id={term.text}
                    term={term}
                    isSelected={selectedTerms.includes(term.text)}
                    onSelect={() => onSelectTerm(term.text)}
                    onDelete={() => setDeleteDialog({ open: true, term: term.text })}
                    isDragEnabled={true}
                    onEdit={() => {
                      setEditInitialText(term.text);
                      setEditInitialImage(term.image);
                      setEditDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl h-[90vh] bg-card border-border flex flex-col">
          <DialogHeader>
            {!isRenaming ? (
              <div className="flex items-center justify-between">
                <DialogTitle className="text-3xl font-bold">
                  {category.name}
                </DialogTitle>
                {onRenameCategory && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsRenaming(true);
                      setEditedCategoryName(category.name);
                    }}
                  >
                    {t('edit')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  value={editedCategoryName}
                  onChange={(e) => setEditedCategoryName(e.target.value)}
                  placeholder={t('categoryName')}
                  className="border-border"
                />
                <Button
                  onClick={() => {
                    const name = editedCategoryName.trim();
                    if (name && onRenameCategory) {
                      onRenameCategory(category.id, name);
                    }
                    setIsRenaming(false);
                  }}
                >
                  {t('save')}
                </Button>
                <Button variant="outline" onClick={() => setIsRenaming(false)}>
                  {t('cancel')}
                </Button>
              </div>
            )}
            <DialogDescription className="text-muted-foreground">
              {category.terms.length} {category.terms.length === 1 ? t('termCount') : t('termCountPlural')}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 mb-4">
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-gradient-primary text-white shadow-glow"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('addTerm')}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {renderMainContent()}
          </div>
        </DialogContent>
      </Dialog>

      <AddTermDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAdd={(term, image) => {
          onAddTerm(category.id, term, image);
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
        title={t('deleteTermTitle')}
        description={`${t('deleteTermDescription')} "${deleteDialog.term}"?`}
      />

      <EditTermDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialText={editInitialText}
        initialImage={editInitialImage}
        onSave={(newText, newImage) => {
          if (onEditTerm) {
            onEditTerm(category.id, editInitialText, newText, newImage);
          }
        }}
      />
    </>
  );
};
