/* @layer renderer-components @kind types */
import type { useControlsSettings } from '../behavior/useControlsSettings';
import type { ControlsTabDef } from '../ControlsSettings.type';

type ControlsCtrl = ReturnType<typeof useControlsSettings>;
type ActionsTabDef = Extract<ControlsTabDef, { kind: 'actions' }>;
type VerbsTabDef = Extract<ControlsTabDef, { kind: 'verbs' }>;
type OptionsTabDef = Extract<ControlsTabDef, { kind: 'options' }>;

interface ControlsMainProps {
  tabs: readonly ControlsTabDef[];
  ctrl: ControlsCtrl;
}

export type { ActionsTabDef, ControlsCtrl, ControlsMainProps, OptionsTabDef, VerbsTabDef };
