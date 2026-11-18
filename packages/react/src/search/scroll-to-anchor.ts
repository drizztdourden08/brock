/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { controlSources } from '../app/control-sources';
import { lazyLoads } from '../lazy/lazy-loads';
import { toast } from '../toast/toast';
import { focusAnchorControl } from './focus-anchor-control';
import { ANCHOR_ATTRIBUTES, ANCHOR_BUDGET_MS, ANCHOR_FLASH_CLASS, ANCHOR_FLASH_MS } from './search.constants';

const anchorSelector = (anchor: string): string => {
  const safe = CSS.escape(anchor);
  return ANCHOR_ATTRIBUTES.map((attribute) => `[${attribute}="${safe}"]`).join(', ');
};

const scrollToAnchor = (anchor: string, budgetMs = ANCHOR_BUDGET_MS, label = anchor): void => {
  let started = performance.now();
  const attempt = (): void => {
    if (!lazyLoads.isIdle()) started = performance.now();
    const target = document.querySelector<HTMLElement>(anchorSelector(anchor));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add(ANCHOR_FLASH_CLASS);
      setTimeout(() => target.classList.remove(ANCHOR_FLASH_CLASS), ANCHOR_FLASH_MS);
      focusAnchorControl(target);
      return;
    }
    if (performance.now() - started < budgetMs) requestAnimationFrame(attempt);
    else toast(controlSources.get().text(msg('brock-settings:search.anchorMissing', { label })), { variant: 'warning' });
  };
  requestAnimationFrame(attempt);
};

export { scrollToAnchor };
