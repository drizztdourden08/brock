/* @layer electron-main @kind logic */
import { parseInstanceConfig } from './instance-config';

const isInstanceLaunch = (argv: readonly string[] = process.argv): boolean => parseInstanceConfig(argv).name !== null;

export { isInstanceLaunch };
