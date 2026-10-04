/* @layer core @kind logic */
import type { AnyChannel, ChannelDecls, ChannelMaps, DefinedChannels } from './channels.type';
import { MAP_OF_KIND } from './define-channels.constants';

const mapsOf = <D extends ChannelDecls>(channels: D): ChannelMaps<D> => {
  const maps: Record<keyof ChannelMaps<D>, Record<string, string>> = { invoke: {}, send: {}, events: {} };
  for (const [method, decl] of Object.entries<AnyChannel>(channels)) maps[MAP_OF_KIND[decl.kind]][method] = decl.channel;
  return maps as ChannelMaps<D>;
};

const defineChannels = <const D extends ChannelDecls & { maps?: never }>(channels: D): DefinedChannels<D> => ({ ...channels, maps: mapsOf(channels) });

export { defineChannels };
