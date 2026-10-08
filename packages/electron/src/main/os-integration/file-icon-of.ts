/* @layer electron-main @kind logic */
import { existsSync } from 'fs';
import { join } from 'path';
import type { FileIconOf } from './os-integration.type';
import { FILE_ICONS_DIR } from './os-integration.constants';

const fileIconOf = (exe: string, resources: string = process.resourcesPath): FileIconOf => (ext) => {
  const icon = join(resources, FILE_ICONS_DIR, `${ext}.ico`);
  return existsSync(icon) ? icon : `"${exe}",0`;
};

export { fileIconOf };
