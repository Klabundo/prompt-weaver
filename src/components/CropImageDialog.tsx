import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CropImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string; // URL (object URL or remote URL)
  onComplete: (croppedDataUrl: string) => void;
  // Optional output size in pixels
  outputSize?: number; // default 512
}

export const CropImageDialog = ({
  open,
  onOpenChange,
  imageSrc,
  onComplete,
  outputSize = 512,
}: CropImageDialogProps) => {
  const { t } = useTranslation();
  const viewportSize = 360; // square viewport
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  // Compute initial scale and center position when image loads
  const handleImageLoad = () => {
    if (!imgRef.current) return;
    const w = imgRef.current.naturalWidth;
    const h = imgRef.current.naturalHeight;
    setNatural({ w, h });
    const coverScale = Math.max(viewportSize / w, viewportSize / h);
    setScale(coverScale);
    const scaledW = w * coverScale;
    const scaledH = h * coverScale;
    setOffset({ x: (viewportSize - scaledW) / 2, y: (viewportSize - scaledH) / 2 });
  };

  // Clamp offset so image always covers viewport
  const clampOffset = (nx: number, ny: number, s: number) => {
    if (!natural) return { x: nx, y: ny };
    const scaledW = natural.w * s;
    const scaledH = natural.h * s;
    // Left/top cannot be greater than 0; right/bottom must be at least viewportSize
    const minX = Math.min(0, viewportSize - scaledW);
    const maxX = 0;
    const minY = Math.min(0, viewportSize - scaledH);
    const maxY = 0;
    return { x: Math.min(maxX, Math.max(minX, nx)), y: Math.min(maxY, Math.max(minY, ny)) };
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const next = clampOffset(dragStart.current.ox + dx, dragStart.current.oy + dy, scale);
    setOffset(next);
  };
  const onMouseUp = () => {
    setDragging(false);
    dragStart.current = null;
  };
  const onMouseLeave = () => {
    setDragging(false);
    dragStart.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const nextScale = Math.min(6, Math.max(0.1, scale + (delta > 0 ? 0.1 : -0.1)));
    // Keep image roughly centered when zooming
    if (natural) {
      const prevScaledW = natural.w * scale;
      const prevScaledH = natural.h * scale;
      const nextScaledW = natural.w * nextScale;
      const nextScaledH = natural.h * nextScale;
      const cx = offset.x + prevScaledW / 2;
      const cy = offset.y + prevScaledH / 2;
      let nx = cx - nextScaledW / 2;
      let ny = cy - nextScaledH / 2;
      const clamped = clampOffset(nx, ny, nextScale);
      setScale(nextScale);
      setOffset(clamped);
    } else {
      setScale(nextScale);
    }
  };

  const handleConfirm = async () => {
    if (!imgRef.current || !natural) return;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cropX = Math.max(0, -offset.x) / scale;
    const cropY = Math.max(0, -offset.y) / scale;
    const cropSize = viewportSize / scale;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      imgRef.current,
      cropX,
      cropY,
      cropSize,
      cropSize,
      0,
      0,
      canvas.width,
      canvas.height
    );
    const dataUrl = canvas.toDataURL("image/png");
    onComplete(dataUrl);
    onOpenChange(false);
  };

  useEffect(() => {
    if (!open) {
      // reset when closing
      setNatural(null);
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setDragging(false);
      dragStart.current = null;
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{t('cropImage')}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t('cropImageDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 py-2">
          {/* Viewport */}
          <div
            className="relative bg-muted rounded-md overflow-hidden border border-border touch-none select-none"
            style={{ width: viewportSize, height: viewportSize }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onWheel={onWheel}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              onLoad={handleImageLoad}
              alt="to-crop"
              style={{
                position: "absolute",
                left: `${offset.x}px`,
                top: `${offset.y}px`,
                width: natural ? `${natural.w * scale}px` : "auto",
                height: natural ? `${natural.h * scale}px` : "auto",
                maxWidth: "none",
                maxHeight: "none",
                display: "block",
                userSelect: "none",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground" htmlFor="zoom-range">
                {t('zoom')}: {scale.toFixed(2)}x
              </label>
              <Input
                id="zoom-range"
                type="range"
                min={0.1}
                max={6}
                step={0.01}
                value={scale}
                onChange={(e) => {
                  const next = parseFloat(e.target.value);
                  if (!natural) {
                    setScale(next);
                    return;
                  }
                  const prevScaledW = natural.w * scale;
                  const prevScaledH = natural.h * scale;
                  const nextScaledW = natural.w * next;
                  const nextScaledH = natural.h * next;
                  const cx = offset.x + prevScaledW / 2;
                  const cy = offset.y + prevScaledH / 2;
                  let nx = cx - nextScaledW / 2;
                  let ny = cy - nextScaledH / 2;
                  const clamped = clampOffset(nx, ny, next);
                  setScale(next);
                  setOffset(clamped);
                }}
              />
              <p className="text-xs text-muted-foreground">{t('dragToPosition')}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            {t('cancel')}
          </Button>
          <Button onClick={handleConfirm} className="bg-primary">
            {t('confirmCrop')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};