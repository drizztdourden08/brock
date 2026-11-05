/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import { ASIDE_TAB_ID, ASIDE_TAB_LABEL } from '../OptionsPanel.constants';
import type { AsideTab } from './aside-tab.type';

const useAsideTab = (narrow: boolean, select: (id: string) => void): AsideTab => {
  const views = useRandomizerGame()?.views;
  const Aside = views?.optionsAside;
  const [picked, setPicked] = useState(false);
  const choose = (id: string) => {
    setPicked(id === ASIDE_TAB_ID);
    if (id !== ASIDE_TAB_ID) select(id);
  };
  if (!Aside) return { extra: [], choose };
  if (!narrow) return { Side: Aside, extra: [], choose };
  const label = views.optionsAsideLabel ?? ASIDE_TAB_LABEL;
  return { Body: picked ? Aside : undefined, extra: [{ id: ASIDE_TAB_ID, label }], choose };
};

export { useAsideTab };
