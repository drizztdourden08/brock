/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';
import type { MaskRect } from '@drizztdourden08/brock-core/review';

const probe = (selectors: readonly string[]): string => `(() => {
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

const readMaskRects = async (contents: WebContents, selectors: readonly string[]): Promise<MaskRect[]> => {
  if (selectors.length === 0 || contents.isDestroyed()) return [];
  try {
    const found: unknown = await contents.executeJavaScript(probe(selectors), true);
    const { scale, rects } = (found ?? {}) as { scale?: unknown; rects?: unknown };
    const factor = typeof scale === 'number' ? scale : 1;
    if (!Array.isArray(rects)) return [];
    return rects.filter(isMaskRect).map((rect) => ({ x: rect.x * factor, y: rect.y * factor, width: rect.width * factor, height: rect.height * factor }));
  } catch {
    return [];
  }
};

export { readMaskRects };
