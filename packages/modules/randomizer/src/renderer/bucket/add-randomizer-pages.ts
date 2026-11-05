/* @layer renderer-shell @kind logic */
import { useExtraPagesStore } from './behavior/useExtraPagesStore';
import type { RandomizerPage } from './randomizer-page.type';

const addRandomizerPages = (pages: readonly RandomizerPage[]): void => {
  useExtraPagesStore.getState().add(pages);
};

export { addRandomizerPages };
