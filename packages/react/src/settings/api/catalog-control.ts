/* @layer renderer-shell @kind logic */
import type { SettingChoice, SettingControl } from '../settings.type';
import type { CatalogChoice, CatalogControl } from './settings-catalog.type';

const choiceOf = (option: SettingChoice): CatalogChoice => ({
  value: option.value,
  label: option.label,
  ...(option.hint === undefined ? {} : { hint: option.hint }),
  disabled: option.disabled !== undefined && option.disabled !== false,
});

const limitsOf = (limits: { min?: number; max?: number; step?: number; unit?: string }): Omit<CatalogControl, 'kind'> => ({
  ...(limits.min === undefined ? {} : { min: limits.min }),
  ...(limits.max === undefined ? {} : { max: limits.max }),
  ...(limits.step === undefined ? {} : { step: limits.step }),
  ...(limits.unit === undefined ? {} : { unit: limits.unit }),
});

const detailsOf = (control: SettingControl): Omit<CatalogControl, 'kind'> => {
  if ('options' in control) return { choices: control.options.map(choiceOf) };
  if (control.kind === 'range' || control.kind === 'number') return limitsOf(control);
  if (control.kind === 'json') return { shape: control.shape ?? 'any' };
  return {};
};

const catalogControl = (control: SettingControl | undefined, value: unknown): CatalogControl => {
  if (control === undefined) return { kind: typeof value === 'boolean' ? 'toggle' : 'none' };
  return { kind: control.kind, ...detailsOf(control) };
};

export { catalogControl };
