import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface ComfyConfig {
    host: string;
    nodeId: string;
}

export const ComfyUISettings = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [host, setHost] = useState("http://127.0.0.1:8188");
    const [nodeId, setNodeId] = useState("6"); // Default CLIP Text Encode node ID often varies, but 6 or 3 is common

    useEffect(() => {
        const saved = localStorage.getItem("comfy-config");
        if (saved) {
            const config = JSON.parse(saved);
            setHost(config.host || "http://127.0.0.1:8188");
            setNodeId(config.nodeId || "6");
        }
    }, []);

    const handleSave = () => {
        const config: ComfyConfig = { host, nodeId };
        localStorage.setItem("comfy-config", JSON.stringify(config));
        setOpen(false);
        toast.success("ComfyUI Einstellungen gespeichert");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                    <SettingsIcon className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>ComfyUI Integration</DialogTitle>
                    <DialogDescription>
                        Konfiguriere die Verbindung zu deiner lokalen ComfyUI Instanz.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="host">ComfyUI URL</Label>
                        <Input
                            id="host"
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                            placeholder="http://127.0.0.1:8188"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="node-id">CLIP Text Encode Node ID</Label>
                        <Input
                            id="node-id"
                            value={nodeId}
                            onChange={(e) => setNodeId(e.target.value)}
                            placeholder="6"
                        />
                        <p className="text-xs text-muted-foreground">
                            Die ID der Node, in die der Prompt eingefügt werden soll (z.B. ClipTextEncode).
                        </p>
                    </div>
                    <Button onClick={handleSave}>Speichern</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
