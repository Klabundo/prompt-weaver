import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Link } from "lucide-react";
import { CropImageDialog } from "./CropImageDialog";

interface AddTermDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (term: string, image?: string) => void;
}

export const AddTermDialog = ({ open, onOpenChange, onAdd }: AddTermDialogProps) => {
  const { t } = useTranslation();
  const [term, setTerm] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Crop state
  const [cropOpen, setCropOpen] = useState(false);
  const [cropSrc, setCropSrc] = useState<string>("");
  const [tempObjectUrl, setTempObjectUrl] = useState<string | null>(null);

  const resetForm = () => {
    setTerm("");
    setImageUrl("");
    setImageFile(null);
    if (tempObjectUrl) {
      URL.revokeObjectURL(tempObjectUrl);
      setTempObjectUrl(null);
    }
    setCropOpen(false);
    setCropSrc("");
    onOpenChange(false);
  };

  const handleAdd = async () => {
    if (term.trim()) {
      let finalImage = imageUrl;

      if (imageFile) {
        try {
          setUploading(true);
          const formData = new FormData();
          formData.append("file", imageFile);
          const resp = await fetch("/api/upload", { method: "POST", body: formData });
          if (!resp.ok) throw new Error("Upload failed");
          const data = await resp.json();
          onAdd(term.trim(), data.url as string);
          resetForm();
          setUploading(false);
          return;
        } catch (e) {
          setUploading(false);
          return;
        }
      }

      onAdd(term.trim(), finalImage || undefined);
      resetForm();
    }
  };

  // Helper: check if image is square; if not, open crop dialog
  const ensureSquareCropForFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setTempObjectUrl(url);
    const img = new window.Image();
    img.onload = () => {
      const isSquare = img.naturalWidth === img.naturalHeight;
      if (!isSquare) {
        setCropSrc(url);
        setCropOpen(true);
      }
      // If square, keep file as-is
    };
    img.src = url;
  };

  const handleCropped = async (dataUrl: string) => {
    // Convert dataURL to Blob and store as imageFile
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const fileName = imageFile?.name ? imageFile.name.replace(/\.[^.]+$/, "-cropped.png") : "cropped.png";
    const croppedFile = new File([blob], fileName, { type: "image/png" });
    setImageFile(croppedFile);
    setImageUrl("");
    if (tempObjectUrl) {
      URL.revokeObjectURL(tempObjectUrl);
      setTempObjectUrl(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('addTerm')}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('addTermDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="term">{t('termRequired')}</Label>
            <Input
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={t('termPlaceholder')}
              className="border-border bg-background"
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>

          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="url">
                <Link className="h-4 w-4 mr-2" />
                {t('imageUrl')}
              </TabsTrigger>
              <TabsTrigger value="upload">
                <ImageIcon className="h-4 w-4 mr-2" />
                {t('imageUpload')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-2">
              <Label htmlFor="image-url">{t('imageUrlLabel')}</Label>
              <Input
                id="image-url"
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageFile(null);
                }}
                placeholder="https://example.com/image.jpg"
                className="border-border bg-background"
              />
              {/* Hinweis: Zuschneiden wird automatisch für hochgeladene Dateien angeboten. Für externe URLs bitte Bild herunterladen und hochladen, um es zuzuschneiden. */}
              {imageUrl && (
                <p className="text-xs text-muted-foreground">{t('cropHintUrl')}</p>
              )}
            </TabsContent>

            <TabsContent value="upload" className="space-y-2">
              <Label htmlFor="image-file">{t('imageUploadLabel')}</Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImageUrl("");
                    ensureSquareCropForFile(file);
                  }
                }}
                className="border-border bg-background"
              />
              {imageFile && (
                <p className="text-sm text-muted-foreground">
                  {t('imageSelected')}: {imageFile.name}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetForm} className="border-border">
            {t('cancel')}
          </Button>
          <Button onClick={handleAdd} disabled={!term.trim() || uploading} className="bg-primary">
            {t('add')}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Crop Dialog */}
      <CropImageDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        imageSrc={cropSrc}
        onComplete={handleCropped}
        outputSize={512}
      />
    </Dialog>
  );
};
