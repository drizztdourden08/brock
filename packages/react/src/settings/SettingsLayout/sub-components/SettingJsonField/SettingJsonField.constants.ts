/* @layer renderer-shell @kind constants */
import type { SettingJsonShape } from '../../../settings.type';

const JSON_INDENT = 2;
const ERROR_LINE = /line (\d+)/;
const SHAPE_PROBLEMS: Readonly<Record<Exclude<SettingJsonShape, 'any'>, string>> = {
  object: 'Expected a JSON object, in braces.',
  array: 'Expected a JSON array, in brackets.',
};

export { ERROR_LINE, JSON_INDENT, SHAPE_PROBLEMS };
