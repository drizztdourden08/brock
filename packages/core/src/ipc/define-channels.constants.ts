/* @layer core @kind constants */
import type { ChannelDecls, ChannelMaps, MappedChannelKind } from './channels.type';

const MAP_OF_KIND: Record<MappedChannelKind, keyof ChannelMaps<ChannelDecls>> = { invoke: 'invoke', send: 'send', event: 'events' };

export { MAP_OF_KIND };
