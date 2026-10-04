/* @layer core @kind constants */
import type { ChannelDecls, ChannelKind, ChannelMaps } from './channels.type';

const MAP_OF_KIND: Record<ChannelKind, keyof ChannelMaps<ChannelDecls>> = { invoke: 'invoke', send: 'send', event: 'events' };

export { MAP_OF_KIND };
