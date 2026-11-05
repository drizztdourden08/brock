/* @layer core @kind logic */
import { buildPlayerYaml } from '@drizztdourden08/archipelia-client-kit';
import { gameBlock } from './game-block';
import { optionSchema } from './option-schema';
import type { PlayerYamlInput } from './player-yaml.type';

const renderPlayerYaml = (input: PlayerYamlInput): string => {
  const { game, slotName, appVersion } = input;
  return buildPlayerYaml({
    game,
    slotName,
    description: appVersion ? `${game} ${appVersion}` : game,
    schema: optionSchema(input.schemaRows),
    options: gameBlock(input),
    preRolled: input.preRolled,
  });
};

export { renderPlayerYaml };
