"use client";

import { Download, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PdfPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pdfUrl: string;
  title?: string;
}

export const PdfPreviewDialog = ({
  open,
  onOpenChange,
  pdfUrl,
  title = "Resume Preview",
}: PdfPreviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full h-[95vh] flex flex-col p-4">
        <DialogHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <a
                href={pdfUrl}
                download
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </a>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-border hover:bg-card transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open
              </a>
            </div>
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>
        <iframe
          src={`${pdfUrl}#toolbar=0`}
          className="w-full flex-1 rounded-lg border border-border"
          title={title}
        />
      </DialogContent>
    </Dialog>
  );
};
