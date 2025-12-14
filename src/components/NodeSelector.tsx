import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface ComfyNode {
    id: number;
    type: string;
    title?: string;
    widgets?: { name: string; value?: any }[];
}

interface NodeSelectorProps {
    onNodeSelect: (nodeId: number | null) => void;
    selectedNodeId: number | null;
}

export const NodeSelector = ({ onNodeSelect, selectedNodeId }: NodeSelectorProps) => {
    const { t } = useTranslation();
    const [nodes, setNodes] = useState<ComfyNode[]>([]);
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const fetchNodes = () => {
        setLoading(true);
        try {
            // @ts-ignore - accessing window.opener which might be ComfyUI
            const app = window.opener?.app;

            if (!app || !app.graph) {
                setIsConnected(false);
                setNodes([]);
                setLoading(false);
                return;
            }

            setIsConnected(true);
            const graphNodes: any[] = app.graph._nodes || [];

            // Filter for nodes that are likely text encoders or have text widgets
            // Common types: CLIPTextEncode, PrimitiveNode (string), Etch, etc.
            // Or just check if they have a widget named "text" or "text_positive" etc.
            const textNodes = graphNodes.filter(node => {
                // Check 1: Known Types
                const isKnownType = ["CLIPTextEncode", "PrimitiveNode"].includes(node.type);

                // Check 2: Has 'text' widget
                const hasTextWidget = node.widgets?.some((w: any) =>
                    w.name === "text" ||
                    w.name === "text_g" ||
                    w.name === "text_l" ||
                    w.name === "string"
                );

                return isKnownType || hasTextWidget;
            }).map(node => ({
                id: node.id,
                type: node.type,
                title: node.title || node.type,
                widgets: node.widgets
            }));

            setNodes(textNodes);

            // If previously selected node still exists, keep it, else reset
            if (selectedNodeId && !textNodes.find(n => n.id === selectedNodeId)) {
                onNodeSelect(null);
            }

        } catch (e) {
            console.error("Failed to fetch nodes from opener", e);
            setIsConnected(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNodes();
        // Poll every few seconds? Or just manual refresh. Manual is safer for now.
        // Let's do a one-time verify on mount.
    }, []);

    if (!isConnected && !loading) {
        return (
            <Card className="p-4 bg-muted/50 border-dashed">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <LinkIcon className="w-4 h-4" />
                    <span>Not connected to ComfyUI (Popup mode required)</span>
                    <Button variant="ghost" size="icon" onClick={fetchNodes} title="Retry Connection">
                        <RefreshCw className="w-3 h-3" />
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <div className="flex items-center gap-2 w-full">
            <Select
                value={selectedNodeId?.toString() || ""}
                onValueChange={(val) => onNodeSelect(val ? parseInt(val) : null)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Target Node..." />
                </SelectTrigger>
                <SelectContent>
                    {nodes.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">No compatible text nodes found</div>
                    ) : (
                        nodes.map((node) => (
                            <SelectItem key={node.id} value={node.id.toString()}>
                                <span className="font-medium mr-2">#{node.id}</span>
                                {node.title !== node.type ? `${node.title} (${node.type})` : node.title}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
            <Button
                variant="outline"
                size="icon"
                onClick={fetchNodes}
                disabled={loading}
                title="Refresh Node List"
            >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
        </div>
    );
};
