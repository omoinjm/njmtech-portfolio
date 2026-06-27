# Omoi Companion — Product & Implementation Plan

Companion feature for the NJMTECH portfolio: extend the existing **FloatingAssistant** (Omoi) with purposeful animations and guide discovery — inspired by Codex Pets (status UI) and Claude Buddy (terminal companion), adapted for a professional portfolio site.

## Problem statement

Pet features in Claude Code and Codex solve **ambient status** for long-running AI work. This portfolio already has:

- **FloatingAssistant** (Omoi) — chat, TTS, quick prompts
- **Footer guides** — Keyboard Guide, Keyboard Shortcuts, SEO Guide, llms.txt
- **Custom events** — `open-shortcuts`, `open-seo-guide`, `open-keyboard-guide`

A second “pet” would duplicate these. The opportunity is **one companion, two jobs**.

## One companion, two roles

| Role | Purpose | User question it answers |
|------|---------|---------------------------|
| **Assistant animations** | Show what Omoi is doing | “Is it thinking, talking, or ready?” |
| **Guide helper** | Surface hidden site tools | “What else can this site do?” |

### Positioning (one sentence)

> **Omoi is the portfolio’s ambient helper: animated feedback for the AI assistant, and a friendly way to discover shortcut and guide tools.**

---

## Role 1: Assistant animation states

Omoi uses a **Codex-compatible spritesheet** (`public/omoi/spritesheet.webp`) — one atlas, CSS `steps()` row playback (whole-body loops, not image swapping).

| Portfolio state | Codex row | When |
|-----------------|-----------|------|
| **Idle** | `idle` (0) | Panel closed |
| **Ready** | `waiting` (6) | Panel open, waiting |
| **Thinking** | `running` (7) | Chat / WebSocket loading |
| **Speaking** | `jumping` (4) | TTS active |
| **Guide** | `waving` (3) | Guide opened / tip pulse |

Atlas spec (matches [Codex pet contract](https://github.com/openai/skills/blob/main/skills/.curated/hatch-pet/references/codex-pet-contract.md)):

- **1536 × 1872** px, **8 × 9** grid, **192 × 208** px cells
- Manifest: `public/omoi/pet.json`

### Triggers

- `activeLoading` (`isLoading || isWsTyping`) → **Thinking**
- `isSpeaking` from `useSpeech` → **Speaking**
- `isOpen` → **Ready** vs **Idle**
- Guide events / session tip → **Guide**

---

## Role 2: Guide helper

Footer utilities are easy to miss. Omoi promotes **discovery**, not full SEO teaching.

### Guides to promote

| Guide | Event | Footer label |
|-------|-------|--------------|
| Site keyboard shortcuts | `open-shortcuts` | Keyboard Shortcuts (`?`) |
| SEO Guide | `open-seo-guide` | SEO Guide |
| EWEADN keyboard manual | `open-keyboard-guide` | Keyboard Guide |
| LLM context (optional) | link to `/llms.txt` | llms.txt |

Omoi dispatches the **same `CustomEvent`s** as the footer.

---

## Art pipeline

### Current (interim atlas)

```bash
pnpm omoi:spritesheet
```

`scripts/build-omoi-spritesheet.ts` composes a Codex-format sheet from portrait frames in `public/omoi/webp/` (idle, ready, thinking, speaking, guide). Output:

- `public/omoi/spritesheet.webp`
- `public/omoi/spritesheet.png`

### Recommended upgrade (true pixel pet)

Use OpenAI **`hatch-pet`** with `--reference public/omoi-mascot-v2.png` and `--style-preset pixel`:

1. Run `/hatch-pet` in Codex (or follow [hatch-pet SKILL](https://github.com/openai/skills/blob/main/skills/.curated/hatch-pet/SKILL.md))
2. Copy `final/spritesheet.webp` → `public/omoi/spritesheet.webp`
3. Keep `public/omoi/pet.json` in sync (row count / frame timing)

No React changes required — drop-in replacement.

---

## Related files

| File | Role |
|------|------|
| `src/components/layout/FloatingAssistant.tsx` | Omoi UI, chat, guide helper |
| `src/components/layout/OmoiSprite.tsx` | Codex-style sprite playback |
| `src/lib/omoi-states.ts` | State resolution |
| `src/lib/omoi-sprite.ts` | Atlas constants + state → row map |
| `scripts/build-omoi-spritesheet.ts` | Interim atlas builder |
| `public/omoi/pet.json` | Codex-compatible manifest |
| `public/omoi/spritesheet.webp` | Animated atlas |
| `public/omoi/webp/*.webp` | Source portraits for atlas builder |

---

## Accessibility

- `prefers-reduced-motion`: static first frame of current row, no float
- Status also conveyed in text (`omoiStatuses`, loading messages)
- `image-rendering: pixelated` for crisp scaling
