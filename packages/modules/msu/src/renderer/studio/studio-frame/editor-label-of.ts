/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../../game/msu-studio-game.type';

const editorLabelOf = (game: MsuStudioGame<never, never>, tabId: string): string => {
  const tab = game.soundTabs.find((entry) => entry.id === tabId);
  return tab?.editorLabel ?? tab?.label ?? tabId;
};

export { editorLabelOf };
