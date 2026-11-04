/* @layer core @kind types */
import type { OnlineHost } from '../../archipelago';

type DeliveryHost = Pick<OnlineHost, 'deliver' | 'cancelDeliveries' | 'onDeliveryReady'>;

export type { DeliveryHost };
