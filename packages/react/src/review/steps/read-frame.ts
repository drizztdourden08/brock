/* @layer renderer-shell @kind logic */
import { SELECTORS } from '../review.constants';
import type { FrameSnapshot } from '../review.type';

const readFrame = (): FrameSnapshot => {
  const layers = [...document.querySelectorAll<HTMLElement>(SELECTORS.layer)];
  const [layer] = layers;
  return {
    layers: layers.length,
    card: layer?.querySelector(SELECTORS.card) != null,
    title: layer?.querySelector(SELECTORS.layerTitle)?.textContent.trim() ?? null,
    closeButton: layer?.querySelector(SELECTORS.layerClose) != null,
  };
};

export { readFrame };
