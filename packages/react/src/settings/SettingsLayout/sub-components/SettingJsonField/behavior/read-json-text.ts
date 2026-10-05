/* @layer renderer-shell @kind logic */
import type { SettingJsonShape } from '../../../../settings.type';
import { ERROR_LINE, SHAPE_PROBLEMS } from '../SettingJsonField.constants';
import type { JsonRead } from '../SettingJsonField.type';

const fitsShape = (value: unknown, shape: SettingJsonShape): boolean => {
  if (shape === 'array') return Array.isArray(value);
  if (shape === 'object') return typeof value === 'object' && value !== null && !Array.isArray(value);
  return true;
};

const lineOf = (message: string): number | undefined => {
  const found = ERROR_LINE.exec(message)?.[1];
  return found === undefined ? undefined : Number(found);
};

const readJsonText = (text: string, shape: SettingJsonShape = 'any'): JsonRead => {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { problem: { message, line: lineOf(message) } };
  }
  if (shape !== 'any' && !fitsShape(value, shape)) return { problem: { message: SHAPE_PROBLEMS[shape], line: 1 } };
  return { value, problem: null };
};

export { readJsonText };
