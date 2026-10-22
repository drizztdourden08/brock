/* @layer renderer-shell @kind hook */
import { useEffect, useMemo } from 'react';
import type { CardProps } from '../../../kinds/screen-kinds.type';
import { useScreenState } from '../../../useScreenState';
import { WINDOW_NAV_PARAM, WINDOW_STATE_KEY } from '../../window.constants';
import type { WindowDef } from '../../window.type';
import { activeItem } from './active-item';
import type { WindowNav } from './useWindowNav.type';
import { windowNavConfig } from './window-nav-config';

const useWindowNav = (def: WindowDef, params: CardProps['params']): WindowNav => {
  const [chosen, choose] = useScreenState<string | null>(WINDOW_STATE_KEY, null);
  const asked = params[WINDOW_NAV_PARAM];
  const config = useMemo(() => windowNavConfig(def), [def]);
  const item = activeItem(def, chosen, asked);

  useEffect(() => {
    if (typeof asked === 'string') choose(asked);
  }, [asked, choose]);

  return { config, item, select: choose };
};

export { useWindowNav };
