"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const KeyboardShortcuts = () => {
  const t = useTranslations("shortcuts");
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const shortcuts = [
    { key: "Ctrl/Cmd + K", description: t("toggle_ai") },
    { key: "Ctrl/Cmd + L", description: t("reset_ai") },
    { key: "Alt + 1", description: t("nav_home") },
    { key: "Alt + 2", description: t("nav_projects") },
    { key: "Alt + 3", description: t("nav_contact") },
    { key: "Alt + 4", description: t("nav_blog") },
    { key: "Esc", description: t("close") },
    { key: "?", description: t("show") },
  ];

  useEffect(() => {
    if (isMobile) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Toggle help with "?"
      if (event.key === "?" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        setIsOpen((prev) => !prev);
      }
    };

    const handleOpenShortcuts = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-shortcuts", handleOpenShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-shortcuts", handleOpenShortcuts);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-border shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Keyboard className="h-5 w-5 text-accent" />
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                {shortcut.description}
              </span>
              <kbd className="pointer-events-none inline-flex h-7 select-none items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-xs font-medium text-foreground opacity-100">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
