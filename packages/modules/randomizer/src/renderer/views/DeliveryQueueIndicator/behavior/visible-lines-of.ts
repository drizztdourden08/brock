/* @layer renderer-shell @kind logic */
import type { DeliverySnapshot } from '../../../../session/delivery/delivery-feed.type';
import type { VisibleLines } from './visible-lines.type';

const visibleLinesOf = ({ pending, delivering }: DeliverySnapshot, maxVisible: number): VisibleLines => {
  const shown = pending.slice(0, delivering === null ? maxVisible : maxVisible - 1);
  return { shown, overflow: pending.length - shown.length };
};

export { visibleLinesOf };
