/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { WidgetWindowOpen } from '@drizztdourden08/brock-core';
import type { PoppedWidget, WidgetContextActive, WidgetDisabledState, WidgetLayout, WidgetManagerProps } from '@drizztdourden08/tessera/composites';
import type { WidgetKitDef } from '../kits/widget-kit.type';
import type { LayoutPreset } from '../layout-preset.type';
import type { WidgetDef } from '../widget.type';

type WidgetContextSource = () => boolean;

type WidgetDisabledOf = (id: string) => WidgetDisabledState | null;

type WidgetDisabledHook = () => WidgetDisabledOf;

interface WidgetHostProps {
  widgets?: readonly WidgetDef[];
  widgetKits?: readonly WidgetKitDef[];
  main?: ReactNode;
  mainLabel?: string;
  widgetContext?: WidgetContextSource;
  layout?: LayoutPreset;
  keepFocusWithApp?: boolean;
  widgetDisabled?: WidgetDisabledHook;
}

type StageProps = Pick<
  WidgetManagerProps<WidgetDef>,
  'definitions' | 'layout' | 'onLayoutChange' | 'contextActive' | 'pageOpen' | 'onPopOut' | 'externalDrag' | 'children' | 'settingsContent'
>;

interface KitStage {
  open: boolean;
  props: StageProps;
  layer: ReactNode;
  popped: readonly PoppedWidget[];
}

interface KitPoppedInput {
  definitions: readonly WidgetDef[];
  layout: WidgetLayout | null;
  blocked: boolean;
  contextActive: WidgetContextActive<WidgetDef> | undefined;
  pageOpen: boolean;
  extraOf: (id: string) => Partial<WidgetWindowOpen>;
}

export type { KitPoppedInput, KitStage, StageProps, WidgetContextSource, WidgetDisabledHook, WidgetDisabledOf, WidgetHostProps };
