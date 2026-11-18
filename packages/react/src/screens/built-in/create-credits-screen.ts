/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { iconNode } from '../conventions/icon-node';
import { INFO_CARD } from '../conventions/screens.constants';
import { defineScreen } from '../define-screen';
import type { ScreenDef } from '../screen.type';

const createCreditsScreen = (credits: ReactNode): ScreenDef => defineScreen({
  id: 'credits',
  title: msg('brock-app:screens.credits'),
  icon: iconNode('file-text'),
  ...INFO_CARD,
  requiresProfile: false,
  render: () => credits,
});

export { createCreditsScreen };
