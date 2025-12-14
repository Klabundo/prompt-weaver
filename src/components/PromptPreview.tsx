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
  selectedNegativeTerms: string[];
  activeMode: "positive" | "negative";
  onModeChange: (mode: "positive" | "negative") => void;
  onClear: () => void;
  onRemoveTerm?: (term: string) => void;
  onReorder?: (newOrder: string[]) => void;
  onUpdateTerm: (oldTerm: string, newTerm: string) => void;
}

export const PromptPreview = ({
  selectedTerms,
  selectedNegativeTerms,
  activeMode,
  onModeChange,
  onClear,
  onRemoveTerm,
  onReorder,
  onUpdateTerm
}: PromptPreviewProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const currentList = activeMode === "positive" ? selectedTerms : selectedNegativeTerms;
  const prompt = currentList.join(", ");

  // For sending, we need both
  const positivePrompt = selectedTerms.join(", ");
  const negativePrompt = selectedNegativeTerms.join(", ");

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
    const saved = localStorage.getItem("comfy-config");
    if (!saved) {
      toast.error(t('comfyConfigMissing'));
      return;
    }
    const { host, nodeId } = JSON.parse(saved);

    try {
      toast.info("Sende Prompts an ComfyUI...");

      const payload = {
        client_id: "prompt-weaver",
        prompt: {
          [nodeId]: {
            inputs: {
              positive_text: positivePrompt,
              negative_text: negativePrompt
            },
            class_type: "PromptWeaverReceiver"
          }
        }
      };

      // Fallback Copy (Active)
      navigator.clipboard.writeText(prompt);

      // Try to send (This assumes user has the node)
      // Since we can't really execute without full graph, we just emulate.
      // But wait! If we provided a JS extension, could we use window.postMessage?
      // No, different origin usually.

      // Let's just do the Copy + Toast as agreed.
      toast.success(`Active Prompt (${activeMode}) kopiert!`);
      toast.message("Falls Node verbunden: Senden simuliert.");

    } catch (e) {
      toast.error("Verbindung zu ComfyUI fehlgeschlagen");
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
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">{t('selectedTermsTitle')}</h2>

        {/* Mode Switcher */}
        <div className="flex bg-muted rounded-lg p-1 mx-2">
          <button
            onClick={() => onModeChange("positive")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeMode === "positive" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            Positive
          </button>
          <button
            onClick={() => onModeChange("negative")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeMode === "negative" ? "bg-background text-destructive shadow" : "text-muted-foreground hover:text-destructive"}`}
          >
            Negative
          </button>
        </div>

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
                className={activeMode === "negative" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-gradient-primary text-white shadow-glow hover:shadow-lg transition-all duration-300"}
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

      <div className={`bg-card rounded-lg p-4 min-h-[100px] border ${activeMode === "negative" ? "border-destructive/20" : "border-border"}`}>
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
            {activeMode === "positive" ? t('selectedTermsDescription') : "Keine negativen Begriffe gewählt."}
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
