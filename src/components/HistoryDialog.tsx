import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { History, Copy, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface HistoryItem {
    timestamp: number;
    prompt: string;
}

export const HistoryDialog = () => {
    const { t } = useTranslation();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [open, setOpen] = useState(false);

    // Hook into clipboard writes to update history
    // Note: This is a bit hacky as we can't easily listen to clipboard changes.
    // Instead, we will expose a method to add to history or listen to storage events.
    // For now, let's just read from localStorage on open.

    const loadHistory = () => {
        try {
            const stored = localStorage.getItem("promptHistory");
            if (stored) {
                setHistory(JSON.parse(stored));
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (open) {
            loadHistory();
        }
    }, [open]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(t('promptCopied'));
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" title="History">
                    <History className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Prompt History
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    {history.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8">
                            No history yet. Copy some prompts!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {history.map((item, i) => (
                                <div key={i} className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg">
                                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {format(item.timestamp, "MMM d, HH:mm")}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => copyToClipboard(item.prompt)}
                                        >
                                            <Copy className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <p className="text-sm font-mono break-words">{item.prompt}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

// Helper utility to save prompt to history
export const addToHistory = (prompt: string) => {
    try {
        const stored = localStorage.getItem("promptHistory");
        const history: HistoryItem[] = stored ? JSON.parse(stored) : [];
        const newHistory = [{ timestamp: Date.now(), prompt }, ...history].slice(0, 50); // Keep last 50
        localStorage.setItem("promptHistory", JSON.stringify(newHistory));
    } catch (e) {
        console.error("Failed to save history", e);
    }
};
