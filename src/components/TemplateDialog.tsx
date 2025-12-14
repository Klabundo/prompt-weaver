import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Trash2, PenLine, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Template {
    id: string;
    name: string;
    terms: string[];
}

interface TemplateDialogProps {
    currentTerms: string[];
    onLoadTemplate: (terms: string[]) => void;
}

export const TemplateDialog = ({ currentTerms, onLoadTemplate }: TemplateDialogProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [templates, setTemplates] = useState<Template[]>([]);
    const [newTemplateName, setNewTemplateName] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("prompt-templates");
        if (saved) {
            setTemplates(JSON.parse(saved));
        }
    }, []);

    const saveTemplates = (newTemplates: Template[]) => {
        setTemplates(newTemplates);
        localStorage.setItem("prompt-templates", JSON.stringify(newTemplates));
    };

    const handleSave = () => {
        if (!newTemplateName) return;
        if (currentTerms.length === 0) {
            toast.error(t('noTermsToSave'));
            return;
        }

        const newTemplate: Template = {
            id: crypto.randomUUID(),
            name: newTemplateName,
            terms: [...currentTerms],
        };

        saveTemplates([...templates, newTemplate]);
        setNewTemplateName("");
        toast.success(t('templateSaved'));
    };

    const handleDelete = (id: string) => {
        saveTemplates(templates.filter(t => t.id !== id));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Save className="h-4 w-4" />
                    {t('templates')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t('templates')}</DialogTitle>
                    <DialogDescription>
                        {t('templateDescription')}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder={t('templateNamePlaceholder')}
                            value={newTemplateName}
                            onChange={(e) => setNewTemplateName(e.target.value)}
                        />
                        <Button onClick={handleSave} disabled={!newTemplateName || currentTerms.length === 0}>
                            <Save className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="text-sm font-medium text-muted-foreground mb-2">
                        {t('savedTemplates')}
                    </div>

                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        {templates.length === 0 ? (
                            <div className="text-center text-muted-foreground text-sm py-8">
                                {t('noTemplates')}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {templates.map((template) => (
                                    <div key={template.id} className="flex items-center justify-between p-2 rounded-lg border hover:bg-accent/50 group">
                                        <span className="font-medium truncate flex-1">{template.name}</span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:text-primary"
                                                onClick={() => {
                                                    onLoadTemplate(template.terms);
                                                    setOpen(false);
                                                    toast.success(t('templateLoaded'));
                                                }}
                                            >
                                                <Upload className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 hover:text-destructive"
                                                onClick={() => handleDelete(template.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};
