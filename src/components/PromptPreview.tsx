import { addToHistory } from "./HistoryDialog";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check, Trash2, Rocket } from "lucide-react";
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
  onUpdateTerm: (oldTerm: string, newTerm: string) => void;
  targetNodeId: number | null;
}

export const PromptPreview = ({
  selectedTerms,
  onClear,
  onRemoveTerm,
  onReorder,
  onUpdateTerm,
  targetNodeId
}: PromptPreviewProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const currentList = selectedTerms;
  const prompt = currentList.join(", ");

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      addToHistory(prompt);
      setCopied(true);
      toast.success(t('promptCopied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSendToComfy = async () => {
    if (!targetNodeId) {
      toast.error("Bitte wähle zuerst eine Target Node aus (oben).");
      return;
    }

    try {
      // @ts-ignore
      const app = window.opener?.app;
      if (!app || !app.graph) {
        toast.error("Keine Verbindung zu ComfyUI (Popup Mode erforderlich).");
        return;
      }

      const node = app.graph.getNodeById(targetNodeId);
      if (!node) {
        toast.error(`Node #${targetNodeId} nicht gefunden.`);
        return;
      }

      // Find the text widget. Usually 'text' or widgets[0] for primitives/CLIPTextEncode
      // We look for specific names or fallback to the first string widget
      const textWidget = node.widgets?.find((w: any) =>
        w.name === "text" ||
        w.name === "text_g" ||
        w.name === "text_l" ||
        w.name === "string"
      );

      if (textWidget) {
        textWidget.value = prompt;
        app.graph.setDirtyCanvas(true, true);
        toast.success(`Prompt an Node #${targetNodeId} gesendet!`);

        // Optional: Queue Prompt? No, user might want to adjust other things.
      } else {
        toast.error(`Kein Text-Widget auf Node #${targetNodeId} gefunden.`);
      }

    } catch (e) {
      console.error(e);
      toast.error("Fehler beim Senden an ComfyUI.");
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = currentList.indexOf(active.id.toString());
      const newIndex = currentList.indexOf(over.id.toString());
      onReorder(arrayMove(currentList, oldIndex, newIndex));
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-card max-h-[80vh] overflow-y-auto custom-scrollbar">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{t('selectedTermsTitle')}</h2>

        <div className="flex gap-2">
          {currentList.length > 0 && (
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
                onClick={handleSendToComfy}
                variant="outline"
                size="sm"
                className="border-border hover:bg-primary/10 hover:text-primary"
                title="Send to ComfyUI"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-gradient-primary text-white shadow-glow hover:shadow-lg transition-all duration-300"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Kopiert
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Kopieren
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg p-4 min-h-[100px] border border-border">
        {currentList.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentList}
              strategy={rectSortingStrategy}
            >
              <DroppableArea id="prompt-tags">
                {currentList.map((term) => (
                  <SortableTag
                    key={term}
                    id={term}
                    text={term}
                    onRemove={(t) => onRemoveTerm?.(t)}
                    onUpdate={(newTerm) => onUpdateTerm(term, newTerm)}
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

      {currentList.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-muted-foreground">
            {currentList.length} {currentList.length === 1 ? t('termCount') : t('termCountPlural')} {t('selected')}
          </div>
          <div className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded select-all max-w-[60%] truncate">
            {prompt}
          </div>
        </div>
      )}
    </Card>
  );
};
