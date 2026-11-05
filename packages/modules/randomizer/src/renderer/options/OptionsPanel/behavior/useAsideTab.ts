/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import { ASIDE_TAB_ID } from '../OptionsPanel.constants';

interface AsideTab {
  isAside: boolean;
  choose(id: string): void;
}

const useAsideTab = (enabled: boolean, select: (id: string) => void): AsideTab => {
  const [picked, setPicked] = useState(false);
  const choose = (id: string) => {
    setPicked(id === ASIDE_TAB_ID);
    if (id !== ASIDE_TAB_ID) select(id);
  };
  return { isAside: enabled && picked, choose };
};

export { useAsideTab };
