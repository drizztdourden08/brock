/* @layer renderer-shell @kind logic */
import type { ReactNode } from 'react';
import { defineScreen } from '../define-screen';
import type { ScreenDef } from '../screen.type';

const createCreditsScreen = (credits: ReactNode): ScreenDef => defineScreen({
  id: 'credits',
  title: 'Credits',
  requiresProfile: false,
  render: () => credits,
});

export { createCreditsScreen };
