import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Trash2, Plus, Image as ImageIcon, Sparkles, Upload } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export interface Template {
    id: string;
    name: string;
    terms: string[];
    image?: string; // Base64 or URL
}

interface TemplatesViewProps {
    onLoadTemplate: (terms: string[]) => void;
}

export const TemplatesView = ({ onLoadTemplate }: TemplatesViewProps) => {
    const { t } = useTranslation();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    // Creator State
    const [newName, setNewName] = useState("");
    const [newImage, setNewImage] = useState("");
    const [newTerms, setNewTerms] = useState<string>(""); // Comma separated input for now

    useEffect(() => {
        const saved = localStorage.getItem("prompt-templates");
        if (saved) {
            try {
                setTemplates(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse templates", e);
            }
        }
    }, []);

    const saveTemplates = (newTemplates: Template[]) => {
        setTemplates(newTemplates);
        localStorage.setItem("prompt-templates", JSON.stringify(newTemplates));
    };

    const handleCreateWrapper = () => {
        setIsCreating(true);
    };

    const handleSaveNew = () => {
        if (!newName.trim()) {
            toast.error("Please enter a name");
            return;
        }

        // simplistic terms parsing
        const termsArray = newTerms.split(',').map(s => s.trim()).filter(Boolean);

        const newTemplate: Template = {
            id: crypto.randomUUID(),
            name: newName,
            terms: termsArray,
            image: newImage
        };

        saveTemplates([...templates, newTemplate]);
        setIsCreating(false);
        setNewName("");
        setNewImage("");
        setNewTerms("");
        toast.success("Template created!");
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this template?")) {
            saveTemplates(templates.filter(t => t.id !== id));
            toast.success("Template deleted");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Template Library</h2>
                    <p className="text-muted-foreground">Manage your favorite prompt collections visually.</p>
                </div>
                {!isCreating && (
                    <Button onClick={handleCreateWrapper} className="gap-2">
                        <Plus className="h-4 w-4" />
                        New Template
                    </Button>
                )}
            </div>

            {isCreating && (
                <Card className="p-6 border-primary/20 bg-muted/20">
                    <h3 className="text-lg font-semibold mb-4">Create New Template</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Name</label>
                                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. 'Cyberpunk City'" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Prompts (comma separated)</label>
                                <textarea
                                    className="w-full min-h-[100px] p-2 rounded-md border bg-background text-sm"
                                    value={newTerms}
                                    onChange={e => setNewTerms(e.target.value)}
                                    placeholder="cyberpunk, neon lights, rain, night..."
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Cover Image</label>
                                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden bg-background/50 hover:bg-background/80 transition-colors">
                                    {newImage ? (
                                        <>
                                            <img src={newImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                                            <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={() => setNewImage("")}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="text-center space-y-2">
                                            <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                                            <div className="text-xs text-muted-foreground">
                                                <span>Paste URL or </span>
                                                <label className="text-primary cursor-pointer hover:underline">
                                                    upload
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                                </label>
                                            </div>
                                            <Input
                                                className="h-8 text-xs mt-2"
                                                placeholder="Or paste image URL..."
                                                onChange={(e) => setNewImage(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                        <Button onClick={handleSaveNew}>Save Template</Button>
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map(template => (
                    <Card key={template.id} className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all hover:shadow-lg">
                        <div className="aspect-video relative bg-muted/50 overflow-hidden">
                            {template.image ? (
                                <img src={template.image} alt={template.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                    <Sparkles className="h-12 w-12" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    className="bg-white text-black hover:bg-white/90"
                                    size="sm"
                                    onClick={() => {
                                        onLoadTemplate(template.terms);
                                        toast.success(`Loaded "${template.name}"`);
                                    }}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Load
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDelete(template.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold truncate" title={template.name}>{template.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                                {template.terms.join(", ")}
                            </p>
                            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{template.terms.length} terms</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {templates.length === 0 && !isCreating && (
                <div className="text-center py-20 text-muted-foreground bg-muted/10 rounded-xl border border-dashed">
                    <p>No templates yet. Create one to get started!</p>
                </div>
            )}
        </div>
    );
};
