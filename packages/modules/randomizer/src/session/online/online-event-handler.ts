/* @layer renderer-shell @kind logic */
import type { ArchipelagoSession, ClientEvent } from '../../archipelago';
import type { SessionStatus } from '../local/randomizer-session.type';
import { onlineEvents } from './online-events';
import { statusAfterEvent } from './status-after-event';

const onlineEventHandler =
  (client: ArchipelagoSession, setStatus: (next: SessionStatus) => void) =>
  (event: ClientEvent): void => {
    onlineEvents.emit(event);
    if (event.type === 'connected') setStatus('active');
    if (event.type === 'disconnected') setStatus(statusAfterEvent(client.status().connection));
  };

export { onlineEventHandler };
