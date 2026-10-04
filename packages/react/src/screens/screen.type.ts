/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { ScreenParams } from '../navigation/navigation.type';
import type { ScreenMenu } from './conventions/screens-config.type';

type ScreenLayerKind = 'fullscreen' | 'own';

type ScreenHeader = 'page' | 'own' | 'none';

interface ScreenRenderContext {
  params: ScreenParams;
  profile: Profile | null;
  close: () => void;
  open: (id: string, params?: ScreenParams) => void;
}

interface ScreenDef {
  id: string;
  title: string;
  icon: ReactNode;
  header?: ScreenHeader;
  render: (ctx: ScreenRenderContext) => ReactNode;
  layer?: ScreenLayerKind;
  keepMounted?: boolean;
  devOnly?: boolean;
  group?: string;
  shortcut?: string;
  requiresProfile?: boolean;
  subtitle?: (ctx: ScreenRenderContext) => ReactNode;
  extra?: (ctx: ScreenRenderContext) => ReactNode;
  floating?: (ctx: ScreenRenderContext) => ReactNode;
  menu?: ScreenMenu;
  order?: number;
  menuOrder?: number;
}

type ScreenInput = Omit<ScreenDef, 'icon'> & { icon: IconName | Exclude<ReactNode, string> };

export type { ScreenDef, ScreenHeader, ScreenInput, ScreenLayerKind, ScreenRenderContext };
