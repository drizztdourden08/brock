/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';
import type { MaskRect } from '@drizztdourden08/brock-core/review';
import { SETTLE_FRAME_MS } from './review-baselines.constants';
import { withinTime } from './within-time';

const probe = (selectors: readonly string[]): string => `(async () => {
  for (const motion of document.getAnimations()) {
    try {
      const timing = motion.effect ? motion.effect.getComputedTiming() : null;
      if (timing && timing.endTime === Infinity) { motion.pause(); motion.currentTime = 0; } else { motion.finish(); }
    } catch { motion.pause(); }
  }
  await Promise.race([
    new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))),
    new Promise((done) => setTimeout(done, ${SETTLE_FRAME_MS})),
  ]);
  const rects = [];
  for (const selector of ${JSON.stringify(selectors)}) {
    let found = [];
    try { found = document.querySelectorAll(selector); } catch { continue; }
    for (const el of found) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) rects.push({ x: r.left, y: r.top, width: r.width, height: r.height });
    }
  }
  return { scale: window.devicePixelRatio || 1, rects };
})()`;

const isMaskRect = (value: unknown): value is MaskRect =>
  typeof value === 'object' && value !== null && ['x', 'y', 'width', 'height'].every((key) => typeof (value as Record<string, unknown>)[key] === 'number');

const scaled = (rect: MaskRect, factor: number): MaskRect =>
  ({ x: rect.x * factor, y: rect.y * factor, width: rect.width * factor, height: rect.height * factor });

const prepareCapture = async (contents: WebContents, selectors: readonly string[]): Promise<MaskRect[]> => {
  if (contents.isDestroyed() || contents.isLoading()) return [];
  const found: unknown = await withinTime<unknown>(contents.executeJavaScript(probe(selectors), true));
  const { scale, rects } = (found ?? {}) as { scale?: unknown; rects?: unknown };
  if (!Array.isArray(rects)) return [];
  return rects.filter(isMaskRect).map((rect) => scaled(rect, typeof scale === 'number' ? scale : 1));
};

export { prepareCapture };
