/* @layer mcp-helper @kind logic */
import { bridgeFileFor } from '@drizztdourden08/brock-electron/bridge';
import { resolve } from 'path';
import { HELPER_TEXT } from './helper.constants';
import type { HelperArgs, TargetOptions } from './helper.type';

const targetFileOf = (args: HelperArgs, { app, appDir }: TargetOptions): string => {
  if (args.file !== null) return resolve(appDir, args.file);
  if (app === null) throw new Error(HELPER_TEXT.noApp);
  const userData = args.userData === null ? null : resolve(appDir, args.userData);
  return bridgeFileFor({ app, userData, instance: args.instance });
};

export { targetFileOf };
