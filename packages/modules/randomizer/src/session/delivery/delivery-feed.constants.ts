/* @layer core @kind constants */
import type { DeliverySnapshot } from './delivery-feed.type';

const EMPTY_SNAPSHOT: DeliverySnapshot = { pending: [], delivering: null };

const SNAPSHOT_KEY_SEPARATOR = '|';

export { EMPTY_SNAPSHOT, SNAPSHOT_KEY_SEPARATOR };
