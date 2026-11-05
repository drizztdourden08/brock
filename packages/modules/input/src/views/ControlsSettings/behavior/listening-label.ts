/* @layer renderer-components @kind logic */
import type { ListeningLabelParams } from './controls-behavior.type';

const listeningLabel = ({ target, game }: ListeningLabelParams): string => {
  switch (target.type) {
    case 'slot':
      return target.slot.label;
    case 'verb':
      return game.verbs?.find((verb) => verb.id === target.id)?.label ?? target.id;
    case 'action': {
      const actions = game.tabs.flatMap((tab) => (tab.kind === 'actions' && tab.scope === target.scope ? tab.actions : []));
      return actions.find((action) => action.id === target.id)?.label ?? target.id;
    }
  }
};

export { listeningLabel };
