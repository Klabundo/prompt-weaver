import { useState } from "react";
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
import { Image, Link } from "lucide-react";

interface AddTermDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (term: string, image?: string) => void;
}

export const AddTermDialog = ({ open, onOpenChange, onAdd }: AddTermDialogProps) => {
  const [term, setTerm] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleAdd = () => {
    if (term.trim()) {
      let finalImage = imageUrl;
      
      if (imageFile) {
        // Convert file to data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          onAdd(term.trim(), reader.result as string);
          resetForm();
        };
        reader.readAsDataURL(imageFile);
        return;
      }
      
      onAdd(term.trim(), finalImage || undefined);
      resetForm();
    }
  };

  const resetForm = () => {
    setTerm("");
    setImageUrl("");
    setImageFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Begriff hinzufügen</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Füge einen neuen Begriff hinzu, optional mit Bild
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="term">Begriff*</Label>
            <Input
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="z.B. house, romantic..."
              className="border-border bg-background"
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>

          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="url">
                <Link className="h-4 w-4 mr-2" />
                Bild URL
              </TabsTrigger>
              <TabsTrigger value="upload">
                <Image className="h-4 w-4 mr-2" />
                Hochladen
              </TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-2">
              <Label htmlFor="image-url">Bild URL (optional)</Label>
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
            </TabsContent>

            <TabsContent value="upload" className="space-y-2">
              <Label htmlFor="image-file">Bild hochladen (optional)</Label>
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImageUrl("");
                  }
                }}
                className="border-border bg-background"
              />
              {imageFile && (
                <p className="text-sm text-muted-foreground">
                  Ausgewählt: {imageFile.name}
                </p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={resetForm} className="border-border">
            Abbrechen
          </Button>
          <Button onClick={handleAdd} disabled={!term.trim()} className="bg-primary">
            Hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
