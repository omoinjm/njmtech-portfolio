"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Wrench, Keyboard } from "lucide-react";

type GuideTip = {
  label: string;
  detail: string;
  keys?: string[];
};

type GuideSection = {
  title: string;
  badge: string;
  badgeClass: string;
  tips: GuideTip[];
};

type TroubleshootingItem = {
  issue: string;
  severity: "common" | "hardware" | "connection";
  steps: string[];
};

const severityColors: Record<TroubleshootingItem["severity"], string> = {
  common: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  connection: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  hardware: "bg-red-500/10 text-red-400 border-red-500/20",
};

const guideSections: GuideSection[] = [
  {
    title: "Device Overview",
    badge: "EWEADN F61",
    badgeClass: "bg-accent/10 text-accent border-accent/20",
    tips: [
      {
        label: "Model",
        detail: "EWEADN F61 — 61-key wireless tri-mode keyboard (Wired / 2.4G / Bluetooth).",
      },
      {
        label: "Bluetooth name",
        detail: "Pair as EWEADN-F61 in your device Bluetooth settings.",
      },
      {
        label: "Compatibility",
        detail: "Windows, macOS, iOS, and Android.",
      },
      {
        label: "Battery",
        detail: "3.7V 2000mAh, charged via USB Type-C at 5V / 500mA.",
      },
      {
        label: "Physical controls",
        detail: "Rear power switch (ON/OFF), Type-C port, and a storage slot for the 2.4G USB receiver.",
      },
    ],
  },
  {
    title: "Connection Modes",
    badge: "Setup",
    badgeClass: "bg-green-500/10 text-green-400 border-green-500/20",
    tips: [
      {
        label: "Wired mode",
        detail: "Connect USB-C, turn power ON, then press FN + B.",
        keys: ["FN", "B"],
      },
      {
        label: "2.4G wireless",
        detail: "Insert the dongle, turn power ON, press FN + V (slow green flash). Long-press FN + V to pair (fast green flash, 30-second window).",
        keys: ["FN", "V"],
      },
      {
        label: "Bluetooth channel 1",
        detail: "Press FN + Z (slow blue flash). Long-press FN + Z to enter pairing (fast blue flash).",
        keys: ["FN", "Z"],
      },
      {
        label: "Bluetooth channel 2",
        detail: "Press FN + X (slow purple flash). Long-press FN + X to enter pairing (fast purple flash).",
        keys: ["FN", "X"],
      },
      {
        label: "Bluetooth channel 3",
        detail: "Press FN + C (slow light-blue flash). Long-press FN + C to enter pairing (fast light-blue flash).",
        keys: ["FN", "C"],
      },
    ],
  },
  {
    title: "FN Shortcuts",
    badge: "Daily use",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    tips: [
      { label: "Function keys", detail: "FN + 1…0 maps to F1…F10. FN + - is F11. FN + = is F12.", keys: ["FN", "1"] },
      { label: "Backtick / tilde", detail: "FN + ESC outputs `. FN + Shift + ESC outputs ~.", keys: ["FN", "ESC"] },
      { label: "Delete", detail: "FN + Backspace acts as Delete.", keys: ["FN", "Backspace"] },
      { label: "Windows lock", detail: "FN + WIN locks or unlocks the Windows and App keys.", keys: ["FN", "WIN"] },
      { label: "Volume", detail: "FN + R lowers volume, FN + T raises volume, FN + Y mutes.", keys: ["FN", "R"] },
      { label: "WASD swap", detail: "FN + W swaps WASD with the arrow keys.", keys: ["FN", "W"] },
    ],
  },
  {
    title: "Lighting & Power",
    badge: "RGB",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    tips: [
      { label: "Lighting modes", detail: "FN + K switches group 1. FN + M switches group 2.", keys: ["FN", "K"] },
      { label: "Backlight toggle", detail: "FN + I turns the backlight on or off.", keys: ["FN", "I"] },
      { label: "Brightness", detail: "FN + O increases brightness. FN + L decreases brightness.", keys: ["FN", "O"] },
      { label: "Breathing speed", detail: "FN + J speeds up breathing. FN + U slows it down.", keys: ["FN", "J"] },
      { label: "Sleep mode", detail: "After 2 minutes of inactivity in wireless modes, lights turn off. Press any key to wake. Sleep is disabled in wired mode." },
      { label: "Battery indicators", detail: "Red slow flash = low battery. Green steady = charging. Light off = fully charged." },
    ],
  },
];

const troubleshootingItems: TroubleshootingItem[] = [
  {
    issue: "Keyboard does not type or wake up",
    severity: "common",
    steps: [
      "Confirm the rear power switch is ON.",
      "Press any key to wake from sleep (wireless modes sleep after 2 minutes).",
      "If the red indicator flashes slowly, charge via USB-C until the green light turns steady.",
      "Switch to wired mode (FN + B) to confirm the keyboard hardware is working.",
    ],
  },
  {
    issue: "Bluetooth will not pair or keeps disconnecting",
    severity: "connection",
    steps: [
      "Remove existing EWEADN-F61 entries from your device's Bluetooth settings.",
      "Turn the keyboard OFF, wait 5 seconds, then turn it ON again.",
      "Long-press FN + Z, FN + X, or FN + C (pick one channel) until the LED flashes quickly — you have a 30-second pairing window.",
      "Search for EWEADN-F61 on your device and pair immediately.",
      "Stay within roughly 10 meters with minimal obstructions.",
      "If pairing still fails, perform a factory reset (see below) and try again on a fresh channel.",
    ],
  },
  {
    issue: "2.4G dongle mode is not working",
    severity: "connection",
    steps: [
      "Plug the receiver directly into the host USB port — avoid unpowered hubs when testing.",
      "Turn the keyboard ON and press FN + V for 2.4G mode (slow green flash).",
      "Long-press FN + V to re-pair (fast green flash, 30-second window).",
      "Try another USB port or machine to rule out a faulty port.",
      "Reseat the dongle and confirm it came from this keyboard (pre-paired set).",
    ],
  },
  {
    issue: "Wrong symbols, missing F-keys, or locked Windows key",
    severity: "common",
    steps: [
      "Use FN + 1…0, FN + -, and FN + = for F1…F12 on the compact 61-key layout.",
      "Use FN + ESC for backtick and FN + Shift + ESC for tilde.",
      "If the Windows key seems disabled, toggle it with FN + WIN.",
      "If WASD behaves like arrow keys, toggle the swap with FN + W.",
    ],
  },
  {
    issue: "Backlight or RGB effects stopped working",
    severity: "common",
    steps: [
      "Press FN + I to toggle the backlight back on.",
      "Cycle lighting with FN + K and FN + M.",
      "Adjust brightness with FN + O and FN + L.",
      "Wake the keyboard if it entered sleep mode — press any key first.",
    ],
  },
  {
    issue: "Factory reset (EWEADN brand-wide fix for stuck connections)",
    severity: "hardware",
    steps: [
      "Ensure the keyboard is powered ON.",
      "Press and hold FN + ESC for 3–8 seconds until the RGB flashes (often three quick bursts on many EWEADN models).",
      "Release both keys and wait 15 seconds without pressing anything.",
      "Re-pair using the correct F61 shortcuts: FN + V (2.4G) or long-press FN + Z / X / C (Bluetooth).",
      "Note: Other EWEADN models may use different channel keys (e.g. FN + 1/2/3). This guide uses F61-specific mappings from your manual.",
    ],
  },
  {
    issue: "Still unresolved after reset",
    severity: "hardware",
    steps: [
      "Test wired mode (USB-C + FN + B) to isolate wireless issues from keyboard hardware.",
      "Move away from strong wireless interference (routers, microwaves, USB 3.0 hubs).",
      "Update Bluetooth drivers or restart the host device before pairing again.",
      "Contact EWEADN support via eweadn.com if keys fail even in wired mode.",
    ],
  },
];

const KeyCombo = ({ keys }: { keys: string[] }) => (
  <span className="ml-auto flex shrink-0 items-center gap-1">
    {keys.map((key, index) => (
      <span key={key} className="flex items-center gap-1">
        {index > 0 && <span className="text-muted-foreground/50 text-[10px]">+</span>}
        <kbd className="inline-flex h-6 min-w-6 select-none items-center justify-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-foreground">
          {key}
        </kbd>
      </span>
    ))}
  </span>
);

export const MechanicalKeyboardGuideDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-keyboard-guide", handleOpen);
    return () => window.removeEventListener("open-keyboard-guide", handleOpen);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-hidden bg-background/95 backdrop-blur-xl border-border shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Keyboard className="h-5 w-5 text-accent" />
            Keyboard Guide
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            EWEADN F61 setup, shortcuts, and troubleshooting
          </p>
        </DialogHeader>

        <Tabs defaultValue="guide">
          <TabsList className="w-full">
            <TabsTrigger value="guide" className="flex-1 gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Guide
            </TabsTrigger>
            <TabsTrigger value="troubleshooting" className="flex-1 gap-1.5">
              <Wrench className="h-3.5 w-3.5" />
              Troubleshooting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="guide">
            <ScrollArea className="h-[58vh] pr-3">
              <div className="space-y-5 py-2">
                {guideSections.map((section) => (
                  <div key={section.title} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{section.title}</span>
                      <Badge variant="outline" className={`ml-auto text-xs ${section.badgeClass}`}>
                        {section.badge}
                      </Badge>
                    </div>
                    <div className="space-y-2 rounded-xl border border-border/50 bg-card/30 p-3">
                      {section.tips.map((tip) => (
                        <div key={tip.label} className="flex items-start gap-2 text-sm">
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-foreground">{tip.label}</span>
                            <span className="text-muted-foreground"> — {tip.detail}</span>
                          </div>
                          {tip.keys && <KeyCombo keys={tip.keys} />}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground text-center pb-1">
                  Based on the EWEADN F61 manual and{" "}
                  <a
                    href="https://www.eweadn.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    eweadn.com
                  </a>
                </p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="troubleshooting">
            <ScrollArea className="h-[58vh] pr-3">
              <div className="space-y-5 py-2">
                <div className="rounded-xl border border-border bg-card/50 p-3 text-xs text-muted-foreground">
                  <p>
                    These steps combine your F61 manual with common EWEADN tri-mode keyboard fixes
                    reported across X87, V97, and V20 documentation. Always prefer F61-specific keys
                    (FN + Z/X/C/V/B) when listed.
                  </p>
                </div>

                {troubleshootingItems.map((item, index) => (
                  <div key={item.issue} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm font-semibold">{item.issue}</span>
                      <Badge variant="outline" className={`ml-auto text-xs ${severityColors[item.severity]}`}>
                        {item.severity}
                      </Badge>
                    </div>
                    <ol className="ml-7 list-decimal space-y-1.5 text-sm text-muted-foreground">
                      {item.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
