/* @layer renderer-shell @kind logic */
import type { LivePage } from '@drizztdourden08/brock-react';
import { useExtraPagesStore } from './extra-pages-store';

const addRandomizerPages = (pages: readonly LivePage[]): void => {
  useExtraPagesStore.getState().add(pages);
};

export { addRandomizerPages };
