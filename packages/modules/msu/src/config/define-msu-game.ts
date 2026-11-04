/* @layer core @kind logic */
import { firstDuplicate } from './first-duplicate';
import type { MsuGameConfig } from './msu-game-config.type';

const defineMsuGame = <Ctx = unknown>(config: MsuGameConfig<Ctx>): MsuGameConfig<Ctx> => {
  const name = firstDuplicate(config.soundChannels.map((channel) => channel.name));
  if (name !== undefined) throw new Error(`MSU game "${config.id}": duplicate sound channel name "${name}"`);
  const index = firstDuplicate(config.soundChannels.map((channel) => channel.coreIndex));
  if (index !== undefined) throw new Error(`MSU game "${config.id}": duplicate sound channel coreIndex ${index}`);
  return config;
};

export { defineMsuGame };
