/* @layer mcp-helper @kind logic */
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const appDirOf = (moduleUrl: string): string => resolve(dirname(fileURLToPath(moduleUrl)), '..', '..');

export { appDirOf };
