/* @layer renderer-shell @kind logic */
import { brandMascot } from '../../brand/brand-mascot';
import { SELECTORS } from '../review.constants';
import type { StepTour } from '../review.type';
import { NO_MASCOT } from './mascot-check.constants';

const checkMascot = (tour: StepTour, id: string, where: string, scope: Element | null): void => {
  const expected = brandMascot(tour.env.product.icons.brand);
  const drawn = scope?.querySelector(SELECTORS.mascot)?.getAttribute('data-mascot') ?? null;
  const shown = drawn === NO_MASCOT ? null : drawn;
  const pass = scope !== null && shown === expected;
  const passReason = expected ? `${where} shows ${expected}, the brand's mascot` : `${where} shows no mascot; the brand has none`;
  tour.check(id, pass, passReason, `${where} shows ${shown ?? 'no mascot'}, expected ${expected ?? 'none'}`);
};

export { checkMascot };
