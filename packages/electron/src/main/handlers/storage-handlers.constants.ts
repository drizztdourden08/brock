/* @layer electron-main @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';

const OS_LABEL: Record<string, Text> = {
  win32: msg('brock-main:storage.os.win32'),
  darwin: msg('brock-main:storage.os.darwin'),
  linux: msg('brock-main:storage.os.linux'),
};

export { OS_LABEL };
