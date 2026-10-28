/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { FrameSnapshot } from '../review.type';

const textOf = (node: Element | null | undefined): string | null => {
  const text = node?.textContent.trim();
  return text === undefined || text === '' ? null : text;
};

const labelledText = (dialog: Element | null | undefined): string | null => {
  const ids = dialog?.getAttribute('aria-labelledby')?.split(/\s+/).filter((id) => id !== '') ?? [];
  const texts = ids.map((id) => textOf(document.getElementById(id))).filter((text): text is string => text !== null);
  return texts.length === 0 ? null : texts.join(' ');
};

const titleOf = (layer: HTMLElement | undefined): string | null => {
  if (!layer) return null;
  const dialog = layer.querySelector(SELECTORS.layerDialog);
  return layer.querySelector(SELECTORS.layerTitle)?.textContent.trim()
    ?? dialog?.getAttribute('aria-label')
    ?? labelledText(dialog)
    ?? textOf(layer.querySelector(SELECTORS.cornerTitle));
};

const readFrame = (): FrameSnapshot => {
  const layers = [...document.querySelectorAll<HTMLElement>(SELECTORS.layer)];
  const [layer] = layers;
  return {
    layers: layers.length,
    card: layer?.querySelector(SELECTORS.card) != null,
    title: titleOf(layer),
    closeButton: layer?.querySelector(SELECTORS.layerClose) != null,
  };
};

export { readFrame };
