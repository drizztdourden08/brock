/* @layer renderer-shell @kind logic */
import { HERO_SLOT_SELECTORS, SELECTORS } from '../review.constants';
import type { HeroSnapshot } from '../review.type';

const filled = (element: Element | null): boolean =>
  element !== null && (element.childElementCount > 0 || element.textContent.trim() !== '');

const readHero = (hub: string, hero: Element | null): HeroSnapshot => ({
  hub,
  rendered: hero !== null,
  title: hero?.querySelector(SELECTORS.heroTitle)?.textContent.trim() ?? '',
  slots: hero ? Object.entries(HERO_SLOT_SELECTORS).filter(([, selector]) => filled(hero.querySelector(selector))).map(([name]) => name) : [],
});

export { readHero };
