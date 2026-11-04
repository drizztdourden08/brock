/* @layer core @kind logic */
import { createListenerSet } from '../../archipelago';
import type { ClientEvent } from '../../archipelago';

const onlineEvents = createListenerSet<[ClientEvent]>();

export { onlineEvents };
