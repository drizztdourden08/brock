/* @layer renderer-shell @kind logic */
import { ANCHOR_BUDGET_MS, ANCHOR_FLASH_CLASS, ANCHOR_FLASH_MS } from './palette.constants';

const anchorSelector = (anchor: string): string => {
  const safe = CSS.escape(anchor);
  return `[data-setting-key="${safe}"], [data-section="${safe}"]`;
};

const scrollToAnchor = (anchor: string, budgetMs = ANCHOR_BUDGET_MS): void => {
  const started = performance.now();
  const attempt = (): void => {
    const target = document.querySelector<HTMLElement>(anchorSelector(anchor));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add(ANCHOR_FLASH_CLASS);
      setTimeout(() => target.classList.remove(ANCHOR_FLASH_CLASS), ANCHOR_FLASH_MS);
      return;
    }
    if (performance.now() - started < budgetMs) requestAnimationFrame(attempt);
  };
  requestAnimationFrame(attempt);
};

export { scrollToAnchor };
