/* @layer electron-main @kind logic */
import { nativeImage } from 'electron';
import type { BrowserWindow } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';
import { getMainWindow } from '../window/get-main-window';
import { boundsOf } from './bounds-of';
import { boundsUnion } from './bounds-union';
import { clusterLayouts } from './cluster-layouts';
import { liveEntries } from './live-entries';
import { COMPOSE_MAX, COMPOSE_MARGIN, COMPOSE_SHADE } from './widget-windows.constants';
import type { CaptureSheet } from './widget-windows.type';

const fill = (sheet: CaptureSheet, box: WidgetWindowBounds, shade: number): void => {
  const left = Math.max(0, Math.round((box.x - sheet.origin.x) * sheet.scale));
  const top = Math.max(0, Math.round((box.y - sheet.origin.y) * sheet.scale));
  const right = Math.min(sheet.width, Math.round((box.x + box.width - sheet.origin.x) * sheet.scale));
  const bottom = Math.min(sheet.height, Math.round((box.y + box.height - sheet.origin.y) * sheet.scale));
  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const at = (y * sheet.width + x) * 4;
      sheet.pixels.fill(shade, at, at + 3);
      sheet.pixels[at + 3] = 255;
    }
  }
};

const paste = async (sheet: CaptureSheet, win: BrowserWindow): Promise<void> => {
  const box = boundsOf(win);
  const width = Math.max(1, Math.round(box.width * sheet.scale));
  const height = Math.max(1, Math.round(box.height * sheet.scale));
  const bitmap = (await win.webContents.capturePage()).resize({ width, height }).toBitmap();
  const left = Math.round((box.x - sheet.origin.x) * sheet.scale);
  const top = Math.round((box.y - sheet.origin.y) * sheet.scale);
  for (let y = 0; y < height; y += 1) {
    const row = top + y;
    if (row < 0 || row >= sheet.height) continue;
    const from = Math.max(0, -left);
    const to = Math.min(width, sheet.width - left);
    if (to > from) bitmap.copy(sheet.pixels, (row * sheet.width + left + from) * 4, (y * width + from) * 4, (y * width + to) * 4);
  }
};

const composeCapture = async (): Promise<Buffer | null> => {
  const main = getMainWindow();
  const backdrops = clusterLayouts.all().flatMap((layout) => (layout.backdrop && !layout.backdrop.isDestroyed() ? [layout.backdrop] : []));
  const widgets = liveEntries().filter(([, entry]) => entry.win.isVisible()).sort(([, a], [, b]) => a.zStamp - b.zStamp).map(([, entry]) => entry.win);
  const windows = [...(main && !main.isDestroyed() ? [main] : []), ...widgets];
  const region = boundsUnion([...backdrops, ...windows].map(boundsOf));
  if (!region) return null;
  const origin = { x: region.x - COMPOSE_MARGIN, y: region.y - COMPOSE_MARGIN, width: region.width + 2 * COMPOSE_MARGIN, height: region.height + 2 * COMPOSE_MARGIN };
  const scale = Math.min(1, COMPOSE_MAX / Math.max(origin.width, origin.height));
  const width = Math.max(1, Math.round(origin.width * scale));
  const height = Math.max(1, Math.round(origin.height * scale));
  const sheet: CaptureSheet = { pixels: Buffer.alloc(width * height * 4), width, height, scale, origin };
  fill(sheet, origin, COMPOSE_SHADE);
  for (const backdrop of backdrops) fill(sheet, boundsOf(backdrop), 0);
  for (const win of windows) await paste(sheet, win);
  return nativeImage.createFromBitmap(sheet.pixels, { width, height }).toPNG();
};

export { composeCapture };
