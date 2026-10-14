/* @layer renderer-shell @kind logic */
import type { SettingChoice } from '../../settings.type';

const reasonOf = (option: SettingChoice): string | undefined => (typeof option.disabled === 'string' ? option.disabled : undefined);

const isOff = (option: SettingChoice): boolean => option.disabled !== undefined && option.disabled !== false;

const anyOff = (options: readonly SettingChoice[]): boolean => options.some(isOff);

const offValues = (options: readonly SettingChoice[]): ReadonlySet<string> => new Set(options.filter(isOff).map((option) => option.value));

const choiceOptions = { reasonOf, isOff, anyOff, offValues };

export { choiceOptions };
