/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SettingJsonShape } from '../../../settings.type';

const JSON_INDENT = 2;
const ERROR_LINE = /line (\d+)/;
const SHAPE_PROBLEMS: Readonly<Record<Exclude<SettingJsonShape, 'any'>, Text>> = {
  object: msg('brock-settings:json.shapeObject'),
  array: msg('brock-settings:json.shapeArray'),
};

export { ERROR_LINE, JSON_INDENT, SHAPE_PROBLEMS };
