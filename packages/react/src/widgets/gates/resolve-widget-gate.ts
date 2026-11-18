/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WidgetDisabledState } from '@drizztdourden08/tessera/composites';
import { fallbackText } from '../../i18n/fallback-text';
import type { WidgetGate, WidgetGateRules } from './widget-gates.type';

const disabledBy = <S>(settingId: string, rules: WidgetGateRules<S>, text: (value: Text) => string): WidgetDisabledState => ({
  message: rules.messageOf?.(settingId) ?? text(msg('brock-app:widgets.gate.unavailable', { setting: settingId })),
  settingId: rules.targetOf(settingId),
});

const resolveWidgetGate = <S>(gate: WidgetGate, settings: S, rules: WidgetGateRules<S>, text: (value: Text) => string = fallbackText): WidgetDisabledState | null => {
  const blocker = rules.gameDataBlockedBy;
  if (gate.readsGameData && blocker !== undefined && rules.isOn(settings, blocker)) return disabledBy(blocker, rules, text);
  if (gate.requiresSetting !== undefined && !rules.isOn(settings, gate.requiresSetting)) return disabledBy(gate.requiresSetting, rules, text);
  return null;
};

export { resolveWidgetGate };
