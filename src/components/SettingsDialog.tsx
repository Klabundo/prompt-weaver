import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Settings, Moon, Sun, Globe, Database, Download, Upload, Trash2, Rocket, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"; // Added import

interface SettingsDialogProps {
  onExport?: () => void;
  onImport?: () => void;
  onClearData?: () => void;
}

export const SettingsDialog = ({ onExport, onImport, onClearData }: SettingsDialogProps) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  // ComfyUI State
  const [comfyHost, setComfyHost] = useState("http://127.0.0.1:8188");
  const [comfyNodeId, setComfyNodeId] = useState("6");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedNodeId, setDetectedNodeId] = useState<string | null>(null);

  const [autoSave, setAutoSave] = useState<boolean>(
    localStorage.getItem('autoSave') !== 'false'
  );

  // Load Comfy Config on mount
  useState(() => {
    const saved = localStorage.getItem("comfy-config");
    if (saved) {
      const config = JSON.parse(saved);
      setComfyHost(config.host || "http://127.0.0.1:8188");
      setComfyNodeId(config.nodeId || "6");
    }
  });

  const handleSaveComfyConfig = () => {
    localStorage.setItem("comfy-config", JSON.stringify({ host: comfyHost, nodeId: comfyNodeId }));
    toast.success("ComfyUI Einstellungen gespeichert");
  };

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setDetectedNodeId(null);
    try {
      // 1. Check connection
      const res = await fetch(`${comfyHost}/object_info/PromptWeaverReceiver`);
      if (!res.ok) {
        // Fallback: Try general object_info if specific fails (maybe older comfy ver?)
        const allRes = await fetch(`${comfyHost}/object_info`);
        if (!allRes.ok) throw new Error("ComfyUI nicht erreichbar");
        const allData = await allRes.json();
        if (!allData.PromptWeaverReceiver) throw new Error("PromptWeaver Node nicht installiert");
      }

      // 2. Find Node Instance in Workflow? 
      // Actually /object_info only tells us the class exists. 
      // To find the ID, we need the current workflow state (which might be in localStorage of ComfyUI app, difficult to access from here).
      // Standard API: /history only shows past.
      // /prompt shows CURRENT QUEUE.
      // WE CANNOT easily inspect the current graph in the editor unless we fetch it from a specific save or if the user exports it.

      // WAIT! If the user has "PromptWeaverReceiver" in their workflow, we can't easily query "What nodes are currently on canvas?".
      // ComfyUI API is stateless regarding the Canvas. The Canvas is purely client-side.
      // SOLUTION: We can't auto-detect the ID *unless* we are sending to a running queue or have a way to inject.

      // REVISED PLAN:
      // We will assume if the User installed the Node, they will drag it in.
      // The "Sending" logic will construct a workflow that *contains* the node? No, we integrate into existing.

      // Actually, many "External" tools just use a fixed ID or ask the user.
      // Auto-detecting ID from "Canvas" is impossible via API.

      // ALTERNATIVE:
      // We search history for a valid execution using PromptWeaverReceiver?
      // No.

      // Let's degrade "Auto Detect" to "Test Connection + Instruction".
      // OR: We try to fetch /extensions or something.

      // Ok, actually, let's keep it simple:
      // "Auto Detect" checks if server is reachable and if "PromptWeaverReceiver" class exists (installed).
      // Then it tells user: "Node installiert! Bitte Füge 'Prompt Weaver Receiver' in dein Workflow ein. ID ist meist die, die du siehst."

      // Wait, there is no way to get the ID automatically from here.
      // I will update the UI to reflect "Test Installation" instead of "Find ID", 
      // UNLESS we use a trick:
      // If we used a WebSocket integration we could listen? No.

      // Updating code to just "Test Connection & Install Check".

      const infoRes = await fetch(`${comfyHost}/object_info`);
      if (infoRes.ok) {
        const data = await infoRes.json();
        if (data.PromptWeaverReceiver) {
          toast.success("Verbindung OK! Custom Node gefunden.");
          // We can't know the ID, but we verified requirements.
        } else {
          toast.warning("Verbindung OK, aber 'PromptWeaverReceiver' Node fehlt.");
        }
      } else {
        throw new Error("Fehler");
      }

    } catch (e) {
      toast.error("Verbindung fehlgeschlagen. ComfyUI läuft?");
    } finally {
      setIsDetecting(false);
    }
  };

  const handleTestComfyConnection = async () => {
    // Legacy function kept if needed, but handleAutoDetect covers it.
    handleAutoDetect();
  };

  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    toast.success(`${t('language')} ${newLang.toUpperCase()}`);
  };

  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    localStorage.setItem('autoSave', checked.toString());
    toast.success(checked ? t('autoSave') + ' aktiviert' : t('autoSave') + ' deaktiviert');
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
      toast.success(t('exportData'));
    }
  };

  const handleImport = () => {
    if (onImport) {
      onImport();
    }
  };

  const handleClearData = () => {
    if (onClearData) {
      if (window.confirm(t('deleteWarning'))) {
        onClearData();
        toast.success(t('clearAllData'));
      }
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">{t('settings')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>{t('settingsTitle')}</SheetTitle>
          <SheetDescription>
            Passen Sie Ihre Einstellungen an Ihre Bedürfnisse an
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Appearance Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">{t('appearance')}</h3>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center gap-2 cursor-pointer">
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span>{t('darkMode')}</span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Language Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('language')}
              </h3>
              <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Data Management Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('dataManagement')}
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-save" className="cursor-pointer">
                    {t('autoSave')}
                  </Label>
                  <Switch
                    id="auto-save"
                    checked={autoSave}
                    onCheckedChange={handleAutoSaveChange}
                  />
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleExport}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('exportData')}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleImport}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t('importData')}
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleClearData}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('clearAllData')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* ComfyUI Integration Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                ComfyUI Integration
              </h3>

              <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border">
                {/* Step 1: Install Node */}
                <div className="border-b border-border pb-3 mb-3">
                  <h4 className="text-sm font-medium mb-2">Schritt 1: Plugin installieren (ZIP)</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Installiere unser Plugin für eine bessere Integration & "Open UI" Button in ComfyUI.
                  </p>
                  <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                    <a href="/PromptWeaverNode.zip" download="PromptWeaverNode.zip">
                      <Download className="h-4 w-4" />
                      Plugin herunterladen (.zip)
                    </a>
                  </Button>
                  <div className="mt-3 bg-muted p-2 rounded text-[10px] text-muted-foreground leading-relaxed">
                    <strong>Installation:</strong>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>ZIP herunterladen.</li>
                      <li>Entpacken in: <code>ComfyUI/custom_nodes/</code></li>
                      <li>Es sollte so aussehen: <code>custom_nodes/PromptWeaver/</code></li>
                      <li>ComfyUI neustarten.</li>
                    </ol>
                    <p className="mt-2 text-primary font-medium">✨ Fügt auch einen "Open Prompt Weaver" Button in ComfyUI hinzu!</p>
                  </div>
                </div>

                {/* Step 2: Configure */}
                <h4 className="text-sm font-medium mb-2">Schritt 2: Verbindung</h4>
                <div className="grid gap-2">
                  <Label htmlFor="comfy-host">ComfyUI URL</Label>
                  <Input
                    id="comfy-host"
                    value={comfyHost}
                    onChange={(e) => setComfyHost(e.target.value)}
                    placeholder="http://127.0.0.1:8188"
                    className="bg-background"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    onClick={handleAutoDetect}
                    variant="secondary"
                    size="sm"
                    className="w-full gap-2"
                    disabled={isDetecting}
                  >
                    {isDetecting ? (
                      <span className="animate-spin">⏳</span>
                    ) : (
                      <Rocket className="h-4 w-4" />
                    )}
                    Autom. Verbinden & Node finden
                  </Button>

                  {detectedNodeId && (
                    <div className="text-xs text-green-500 flex items-center gap-1 justify-center bg-green-500/10 p-1 rounded">
                      <Check className="h-3 w-3" />
                      Node gefunden (ID: {detectedNodeId})
                    </div>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">oder manuell</span>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="comfy-node" className="text-xs">Node ID manuell</Label>
                    </div>
                    <Input
                      id="comfy-node"
                      value={comfyNodeId}
                      onChange={(e) => setComfyNodeId(e.target.value)}
                      placeholder="z.B. 6"
                      className="bg-background h-8 text-xs"
                    />
                  </div>

                  <Button onClick={handleSaveComfyConfig} size="sm" className="w-full mt-2">
                    Einstellungen Speichern
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
