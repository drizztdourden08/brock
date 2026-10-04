/* @layer renderer-shell @kind logic */
import { brandMascot } from '../../brand/brand-mascot';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';

const checkMascot = (tour: StepTour, id: string, where: string, scope: Element | null): void => {
  const expected = brandMascot(tour.env.product.icons.brand) ?? null;
  const shown = scope?.querySelector(SELECTORS.mascot)?.getAttribute('data-mascot') ?? null;
  const pass = scope !== null && shown === expected;
  const passReason = expected ? `${where} shows ${expected}, the brand's mascot` : `${where} shows no mascot; the brand has none`;
  tour.check(id, pass, passReason, `${where} shows ${shown ?? 'no mascot'}, expected ${expected ?? 'none'}`);
};

export { checkMascot };
