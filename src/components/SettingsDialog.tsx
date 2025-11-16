import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Settings, Moon, Sun, Globe, Database, Download, Upload, Trash2 } from "lucide-react";
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

interface SettingsDialogProps {
  onExport?: () => void;
  onImport?: () => void;
  onClearData?: () => void;
}

export const SettingsDialog = ({ onExport, onImport, onClearData }: SettingsDialogProps) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [autoSave, setAutoSave] = useState<boolean>(
    localStorage.getItem('autoSave') !== 'false'
  );

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
        </div>
      </SheetContent>
    </Sheet>
  );
};
