/* @layer renderer-shell @kind logic */
import type { WidgetDisabledState } from '@drizztdourden08/tessera/composites';
import type { WidgetGate, WidgetGateRules } from './widget-gates.type';

const disabledBy = <S>(settingId: string, rules: WidgetGateRules<S>): WidgetDisabledState => ({
  message: rules.messageOf?.(settingId) ?? `Unavailable: ${settingId}`,
  settingId: rules.targetOf(settingId),
});

const resolveWidgetGate = <S>(gate: WidgetGate, settings: S, rules: WidgetGateRules<S>): WidgetDisabledState | null => {
  const blocker = rules.gameDataBlockedBy;
  if (gate.readsGameData && blocker !== undefined && rules.isOn(settings, blocker)) return disabledBy(blocker, rules);
  if (gate.requiresSetting !== undefined && !rules.isOn(settings, gate.requiresSetting)) return disabledBy(gate.requiresSetting, rules);
  return null;
};

export { resolveWidgetGate };
