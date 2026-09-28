/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { ScreenParams } from '../navigation/navigation.type';

type ScreenLayerKind = 'fullscreen' | 'own';

interface ScreenRenderContext {
  params: ScreenParams;
  profile: Profile | null;
  close: () => void;
  open: (id: string, params?: ScreenParams) => void;
}

interface ScreenDef {
  id: string;
  title: string;
  icon?: ReactNode;
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
}

export type { ScreenDef, ScreenLayerKind, ScreenRenderContext };
