import { addToHistory } from "./HistoryDialog";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableTag } from "./SortableTag";
import { DroppableArea } from "./DroppableArea";

interface PromptPreviewProps {
  selectedTerms: string[];
  onClear: () => void;
  onRemoveTerm?: (term: string) => void;
  onReorder?: (newOrder: string[]) => void;
}

export const PromptPreview = ({ selectedTerms, onClear, onRemoveTerm, onReorder }: PromptPreviewProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const prompt = selectedTerms.join(", ");

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      addToHistory(prompt);
      setCopied(true);
      toast.success(t('promptCopied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = selectedTerms.indexOf(active.id.toString());
      const newIndex = selectedTerms.indexOf(over.id.toString());
      onReorder(arrayMove(selectedTerms, oldIndex, newIndex));
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{t('selectedTermsTitle')}</h2>
        <div className="flex gap-2">
          {selectedTerms.length > 0 && (
            <>
              <Button
                onClick={onClear}
                variant="outline"
                size="sm"
                className="border-border hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t('clearSelection')}
              </Button>
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-gradient-primary text-white shadow-glow hover:shadow-lg transition-all duration-300"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {t('promptCopied')}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    {t('copyPrompt')}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 min-h-[100px] border border-border">
        {selectedTerms.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedTerms}
              strategy={rectSortingStrategy}
            >
              <DroppableArea id="prompt-tags">
                {selectedTerms.map((term) => (
                  <SortableTag
                    key={term}
                    id={term}
                    text={term}
                    onRemove={(t) => onRemoveTerm?.(t)}
                  />
                ))}
              </DroppableArea>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            {t('selectedTermsDescription')}
          </p>
        )}
      </div>

      {selectedTerms.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {selectedTerms.length} {selectedTerms.length === 1 ? t('termCount') : t('termCountPlural')} {t('selected')}
          </div>
          <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded select-all">
            {prompt}
          </div>
        </div>
      )}
    </Card>
  );
};
