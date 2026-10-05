/* @layer renderer-shell @kind logic */
import type { TouringKey } from './tour.type';

const touringKey = (event: Pick<KeyboardEvent, 'key' | 'altKey'>, touring: boolean): TouringKey => {
  if (!touring) return null;
  if (event.key === 'Escape') return 'close';
  return event.altKey && event.key === 'Enter' ? null : 'skip';
};

export { touringKey };
