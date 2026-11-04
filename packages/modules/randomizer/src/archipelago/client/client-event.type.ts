/* @layer core @kind types */
import type { DeathLinkNotice } from '../deathlink/death-link.type';
import type { OnlineNotice } from '../messages/notice.type';
import type { ReceivedItem } from './online-host.type';

type ClientEvent =
  | { type: 'connected'; slotName: string; url: string }
  | { type: 'disconnected'; reason: string }
  | { type: 'item-received'; item: ReceivedItem; own: boolean }
  | { type: 'location-checked'; locationId: number }
  | { type: 'notice'; notice: OnlineNotice }
  | { type: 'death-link'; notice: DeathLinkNotice };

export type { ClientEvent };
