/* @layer renderer-shell @kind logic */
import { TESSERA_STRING_PARAMS } from '@drizztdourden08/tessera/primitives';
import type { I18n } from '@drizztdourden08/brock-core/i18n';
import type { ParamTable, StringFunction } from './tessera-strings-of.type';
import { tesseraMessageOf } from './tessera-message-of';

const tesseraFunctionString = (i18n: I18n, group: string, name: string): StringFunction | undefined => {
  if (tesseraMessageOf(i18n, group, name) === undefined) return undefined;
  const names = (TESSERA_STRING_PARAMS as ParamTable)[group]?.[name] ?? [];
  return (...args) => {
    const values: Record<string, string> = {};
    names.forEach((param, index) => {
      values[param] = String(args[index] ?? '');
    });
    return tesseraMessageOf(i18n, group, name, values) ?? '';
  };
};

export { tesseraFunctionString };
