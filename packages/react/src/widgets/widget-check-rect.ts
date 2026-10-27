/* @layer renderer-shell @kind logic */
import type { Rect } from '@drizztdourden08/tessera/composites';

const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const checkRect = (rect: Partial<Rect>): void => {
  if (!finite(rect.width) || !finite(rect.height) || rect.width <= 0 || rect.height <= 0) throw new Error('A rect needs a positive width and height.');
  if ((rect.x !== undefined && !finite(rect.x)) || (rect.y !== undefined && !finite(rect.y))) throw new Error('x and y must be numbers.');
};

export { checkRect };
