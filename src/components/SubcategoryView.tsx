import { useTranslation } from "react-i18next";
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
  onRequestEditTerm?: (term: Term) => void;
}

export const SubcategoryView = ({
  subcategoryName,
  terms,
  selectedTerms,
  onSelectTerm,
  onRemoveTerm,
  onBack,
  onRequestEditTerm,
}: SubcategoryViewProps) => {
  const { t } = useTranslation();
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
              {terms.length} {terms.length === 1 ? t('termCount') : t('termCountPlural')}
            </p>
          </div>
          <Button onClick={onBack} variant="outline" size="lg">
            ← {t('back')}
          </Button>
        </div>

        {terms.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <ImageIcon className="h-20 w-20 mx-auto mb-6 opacity-30" />
            <p className="text-xl">{t('noTerms')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {terms.map((term) => {
              const isSelected = selectedTerms.includes(term.text);
              return (
                <Card
                  key={term.text}
                  onClick={() => onSelectTerm(term.text)}
                  className={`group relative p-4 bg-gradient-card shadow-card hover:shadow-glow transition-all duration-300 cursor-pointer border-border/50 ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {term.image ? (
                        <img src={term.image} alt={term.text} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium truncate">{term.text}</p>
                      <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onRequestEditTerm && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRequestEditTerm(term);
                            }}
                          >
                            {t('edit')}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteDialog({ open: true, term: term.text });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
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
        title={t('deleteTermTitle')}
        description={`${t('deleteTermDescription')} "${deleteDialog.term}"?`}
      />
    </>
  );
}
