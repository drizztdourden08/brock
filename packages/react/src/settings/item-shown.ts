/* @layer renderer-shell @kind logic */
import { readPath } from '../volume/read-path';
import type { SettingItem, SettingValues, SettingVisibleWhen } from './settings.type';

const valueOf = (values: SettingValues, key: string): unknown => (Object.hasOwn(values, key) ? values[key] : readPath(values, key));

const ruleHolds = (rule: SettingVisibleWhen, values: SettingValues): boolean => {
  const value = valueOf(values, rule.key);
  return 'equals' in rule ? Object.is(value, rule.equals) : !Object.is(value, rule.notEquals);
};

const itemShown = (item: SettingItem, values: SettingValues): boolean =>
  (item.visible === undefined || item.visible(values)) && (item.visibleWhen === undefined || ruleHolds(item.visibleWhen, values));

export { itemShown };
