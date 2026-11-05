/* @layer renderer-shell @kind types */
import type { WidgetDisabledHook } from '../WidgetHost/WidgetHost.type';

interface WidgetGate {
  readsGameData?: boolean;
  requiresSetting?: string;
}

interface WidgetGateRules<S> {
  isOn: (settings: S, settingId: string) => boolean;
  gameDataBlockedBy?: string;
  messageOf?: (settingId: string) => string | undefined;
  targetOf: (settingId: string) => string;
}

interface WidgetGatesConfig<S> extends WidgetGateRules<S> {
  gates: Readonly<Record<string, WidgetGate>>;
  useSettings: () => S;
}

type WidgetGatesHook = WidgetDisabledHook;

export type { WidgetGate, WidgetGateRules, WidgetGatesConfig, WidgetGatesHook };
