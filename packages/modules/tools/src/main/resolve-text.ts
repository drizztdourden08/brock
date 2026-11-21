/* @layer electron-main @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { ToolsEnv } from './tools-main.type';

const resolveText = (env: Pick<ToolsEnv, 'text'>, value: Text): string => {
  if (env.text) return env.text(value);
  return typeof value === 'string' ? value : value.key;
};

export { resolveText };
