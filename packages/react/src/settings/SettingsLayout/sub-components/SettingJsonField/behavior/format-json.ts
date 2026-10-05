/* @layer renderer-shell @kind logic */
import { JSON_INDENT } from '../SettingJsonField.constants';

const formatJson = (value: unknown): string => JSON.stringify(value, null, JSON_INDENT);

export { formatJson };
