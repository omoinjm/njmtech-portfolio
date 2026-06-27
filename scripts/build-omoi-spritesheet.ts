/**
 * Builds a Codex-compatible Omoi spritesheet (1536×1872, 8×9 grid, 192×208 cells)
 * from existing portrait frames in public/omoi/webp/.
 *
 * Replace output with hatch-pet spritesheet.webp when available:
 * @see docs/OMOI_COMPANION.md
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const CELL_W = 192;
const CELL_H = 208;
const COLS = 8;
const ROWS = 9;
const SHEET_W = 1536;
const SHEET_H = 1872;

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public/omoi");
const WEBP_DIR = path.join(OUT_DIR, "webp");
const FALLBACK = path.join(ROOT, "public/omoi-mascot-v2.png");

type FrameSpec = {
  file: string;
  offsetX?: number;
  offsetY?: number;
  flipX?: boolean;
};

async function resolveSource(file: string) {
  const webpPath = path.join(WEBP_DIR, file);
  try {
    await fs.access(webpPath);
    return webpPath;
  } catch {
    return FALLBACK;
  }
}

async function renderCell(spec: FrameSpec) {
  const source = await resolveSource(spec.file);
  let image = sharp(source).resize(CELL_W - 28, CELL_H - 36, { fit: "inside" });

  if (spec.flipX) {
    image = image.flop();
  }

  const resized = await image.toBuffer();
  const meta = await sharp(resized).metadata();
  const padLeft = Math.max(0, Math.round((CELL_W - (meta.width ?? CELL_W)) / 2 + (spec.offsetX ?? 0)));
  const padTop = Math.max(0, Math.round((CELL_H - (meta.height ?? CELL_H)) / 2 + (spec.offsetY ?? 0)));
  const padRight = Math.max(0, CELL_W - (meta.width ?? CELL_W) - padLeft);
  const padBottom = Math.max(0, CELL_H - (meta.height ?? CELL_H) - padTop);

  return sharp(resized)
    .extend({
      top: padTop,
      bottom: padBottom,
      left: padLeft,
      right: padRight,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function buildRow(specs: FrameSpec[]) {
  const cells = await Promise.all(
    Array.from({ length: COLS }, (_, index) => renderCell(specs[index % specs.length]!)),
  );

  return sharp({
    create: {
      width: SHEET_W,
      height: CELL_H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(cells.map((input, index) => ({ input, left: index * CELL_W, top: 0 })))
    .png()
    .toBuffer();
}

function cycle<T>(items: T[], count: number) {
  return Array.from({ length: count }, (_, index) => items[index % items.length]!);
}

const ROW_SPECS: FrameSpec[][] = [
  // 0 idle — gentle bob
  cycle(
    [
      { file: "idle-1.webp", offsetY: -2 },
      { file: "idle-2.webp", offsetY: 0 },
      { file: "idle-1.webp", offsetY: 2 },
      { file: "idle-2.webp", offsetY: 0 },
    ],
    COLS,
  ),
  // 1 running-right — drift right
  cycle(
    [
      { file: "idle-1.webp", offsetX: 0 },
      { file: "idle-2.webp", offsetX: 4 },
      { file: "idle-1.webp", offsetX: 8 },
      { file: "idle-2.webp", offsetX: 12 },
    ],
    COLS,
  ),
  // 2 running-left — drift left
  cycle(
    [
      { file: "idle-1.webp", offsetX: 0, flipX: true },
      { file: "idle-2.webp", offsetX: -4, flipX: true },
      { file: "idle-1.webp", offsetX: -8, flipX: true },
      { file: "idle-2.webp", offsetX: -12, flipX: true },
    ],
    COLS,
  ),
  // 3 waving — guide pose micro motion
  cycle(
    [
      { file: "guide.webp", offsetY: 0 },
      { file: "guide.webp", offsetY: -2 },
      { file: "guide.webp", offsetY: 0 },
      { file: "guide.webp", offsetY: 2 },
    ],
    COLS,
  ),
  // 4 jumping / speaking
  cycle(
    [
      { file: "speaking-1.webp", offsetY: 4 },
      { file: "speaking-2.webp", offsetY: -2 },
      { file: "speaking-1.webp", offsetY: 6 },
      { file: "speaking-2.webp", offsetY: 0 },
    ],
    COLS,
  ),
  // 5 failed — nervous shake
  cycle(
    [
      { file: "thinking-1.webp", offsetX: -3 },
      { file: "thinking-2.webp", offsetX: 3 },
      { file: "thinking-1.webp", offsetX: -2 },
      { file: "thinking-2.webp", offsetX: 2 },
    ],
    COLS,
  ),
  // 6 waiting / ready
  cycle(
    [
      { file: "ready.webp", offsetY: 0 },
      { file: "ready.webp", offsetY: -1 },
      { file: "ready.webp", offsetY: 0 },
      { file: "ready.webp", offsetY: 1 },
    ],
    COLS,
  ),
  // 7 running / thinking
  cycle(
    [
      { file: "thinking-1.webp", offsetY: 0 },
      { file: "thinking-2.webp", offsetY: -1 },
      { file: "thinking-1.webp", offsetY: 1 },
      { file: "thinking-2.webp", offsetY: 0 },
    ],
    COLS,
  ),
  // 8 review
  cycle(
    [
      { file: "ready.webp", offsetX: -2 },
      { file: "ready.webp", offsetX: 0 },
      { file: "ready.webp", offsetX: 2 },
      { file: "ready.webp", offsetX: 0 },
    ],
    COLS,
  ),
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const rowBuffers = await Promise.all(ROW_SPECS.map((specs) => buildRow(specs)));

  const sheet = sharp({
    create: {
      width: SHEET_W,
      height: SHEET_H,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite(
    rowBuffers.map((input, index) => ({
      input,
      left: 0,
      top: index * CELL_H,
    })),
  );

  const webpOut = path.join(OUT_DIR, "spritesheet.webp");
  const pngOut = path.join(OUT_DIR, "spritesheet.png");

  await sheet.clone().webp({ quality: 92, alphaQuality: 100 }).toFile(webpOut);
  await sheet.clone().png().toFile(pngOut);

  console.log(`Wrote ${webpOut}`);
  console.log(`Wrote ${pngOut}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
