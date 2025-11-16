import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PromptPreviewProps {
  selectedTerms: string[];
  onClear: () => void;
}

export const PromptPreview = ({ selectedTerms, onClear }: PromptPreviewProps) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const prompt = selectedTerms.join(", ");

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast.success(t('promptCopied'));
      setTimeout(() => setCopied(false), 2000);
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
                className="border-border"
              >
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
        {prompt ? (
          <p className="text-foreground font-mono text-sm leading-relaxed animate-fade-in">
            {prompt}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm italic">
            {t('selectedTermsDescription')}
          </p>
        )}
      </div>

      {selectedTerms.length > 0 && (
        <div className="mt-4 text-xs text-muted-foreground">
          {selectedTerms.length} {selectedTerms.length === 1 ? t('termCount') : t('termCountPlural')} {t('selected')}
        </div>
      )}
    </Card>
  );
};
