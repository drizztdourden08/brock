/* @layer renderer-shell @kind types */
import type { DeliveryLine } from '../../../../session/delivery/delivery-feed.type';

interface VisibleLines {
  shown: readonly DeliveryLine[];
  overflow: number;
}

export type { VisibleLines };
