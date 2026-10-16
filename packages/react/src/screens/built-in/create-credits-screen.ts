/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import { iconNode } from '../conventions/icon-node';
import { INFO_CARD } from '../conventions/screens.constants';
import { defineScreen } from '../define-screen';
import type { ScreenDef } from '../screen.type';

const createCreditsScreen = (credits: ReactNode): ScreenDef => defineScreen({
  id: 'credits',
  title: 'Credits',
  icon: iconNode('file-text'),
  ...INFO_CARD,
  requiresProfile: false,
  render: () => credits,
});

export { createCreditsScreen };
