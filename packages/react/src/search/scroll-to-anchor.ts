/* @layer renderer-shell @kind logic */
import { ANCHOR_ATTRIBUTES, ANCHOR_BUDGET_MS, ANCHOR_FLASH_CLASS, ANCHOR_FLASH_MS } from './search.constants';

const anchorSelector = (anchor: string): string => {
  const safe = CSS.escape(anchor);
  return ANCHOR_ATTRIBUTES.map((attribute) => `[${attribute}="${safe}"]`).join(', ');
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
