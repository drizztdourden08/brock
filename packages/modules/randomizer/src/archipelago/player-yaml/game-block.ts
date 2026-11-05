/* @layer core @kind logic */
import { DEFAULT_PROGRESSION_BALANCING, GENERATOR_OWNED_KEYS } from './player-yaml.constants';
import { withDeathLink } from './with-death-link';
import type { PlayerYamlInput } from './player-yaml.type';

const gameBlock = (input: PlayerYamlInput): Record<string, unknown> => {
  const block = withDeathLink(input.values, input.deathLink);
  for (const key of GENERATOR_OWNED_KEYS) delete block[key];
  if (!('progression_balancing' in block)) block.progression_balancing = DEFAULT_PROGRESSION_BALANCING;
  if (input.seedText !== undefined) block.seed_text = input.seedText;
  return input.block === undefined ? block : input.block(block);
};

export { gameBlock };
