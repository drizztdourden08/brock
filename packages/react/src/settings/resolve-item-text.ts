/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { TextOf } from './resolve-item-text.type';
import type { SettingAction, SettingActionDef, SettingChoice, SettingChoiceDef, SettingControl, SettingControlDef, SettingDescription, SettingItem, SettingItemDef } from './settings.type';

const choiceOf = (choice: SettingChoiceDef, text: TextOf): SettingChoice => {
  const { label, hint, ...rest } = choice;
  return { ...rest, label: text(label), ...(hint === undefined ? {} : { hint: text(hint) }) };
};

const controlOf = (control: SettingControlDef, text: TextOf): SettingControl => {
  if (!('options' in control)) return control;
  return { ...control, options: control.options.map((option) => choiceOf(option, text)) };
};

const actionOf = (action: SettingActionDef, text: TextOf): SettingAction => ({ ...action, label: text(action.label) });

const descriptionOf = (item: SettingItemDef, text: TextOf): SettingDescription =>
  (item.description === undefined ? { noDescription: true } : { description: text(item.description) });

const resolveItemText = (item: SettingItemDef, text: TextOf): SettingItem => {
  const { label, hint, control, actions, description: _description, noDescription: _none, ...rest } = item;
  return {
    ...rest,
    label: text(label),
    ...(hint === undefined ? {} : { hint: text(hint) }),
    ...(control === undefined ? {} : { control: controlOf(control, text) }),
    ...(actions === undefined ? {} : { actions: actions.map((action) => actionOf(action, text)) }),
    ...descriptionOf(item, text),
  };
};

export { resolveItemText };
