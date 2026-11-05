/* @layer renderer-shell @kind types */
import type { DeliveryLine } from '../../../../../session/delivery/delivery-feed.type';

interface QueueEntryProps {
  line: DeliveryLine;
  active: boolean;
}

export type { QueueEntryProps };
