/* @layer electron-main @kind test */
import { mkdir, readdir, rm, writeFile } from 'fs/promises';
import { dirname, join, sep } from 'path';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { makeTree, testAccess } from './folder-fixture';

interface OpsWorld {
  base: string;
  granted: string;
  outside: string;
  appDir: string;
  access: DocumentAccess;
  trashed: string[];
}

const makeAppDir = async (granted: string): Promise<string> => {
  const appDir = join(granted, 'app');
  await mkdir(join(appDir, 'Data'), { recursive: true });
  await writeFile(join(appDir, 'Data', 'app.json'), '{}');
  return appDir;
};

const openWorld = async (prefix: string): Promise<OpsWorld> => {
  const { base, granted, outside } = await makeTree(prefix);
  const appDir = await makeAppDir(granted);
  const trashed: string[] = [];
  const access = testAccess({
    protectedRoots: () => [appDir],
    trashItem: async (path) => {
      trashed.push(path);
      await rm(path, { recursive: true, force: true });
    },
  });
  access.allowFolder(granted);
  return { base, granted, outside, appDir, access, trashed };
};

const put = async (path: string, text = 'x'): Promise<string> => {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text);
  return path;
};

const names = async (dir: string): Promise<string[]> => (await readdir(dir)).sort();

const dots = (granted: string, ...rest: string[]): string => [granted, '..', ...rest].join(sep);

export { dots, makeAppDir, names, openWorld, put };
export type { OpsWorld };
