/* @layer electron-main @kind test */
import { afterEach, beforeEach } from 'vitest';
import { mkdir, readdir, rm, writeFile } from 'fs/promises';
import { dirname, join, sep } from 'path';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { makeTree, testAccess } from './folder-fixture';
import { markOfTheWeb } from './mark-of-the-web-mock';

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

const dirLink = process.platform === 'win32' ? 'junction' : 'dir';

const putPair = async (granted: string): Promise<void> => {
  await put(join(granted, 'tree', 'a.txt'), 'A');
  await put(join(granted, 'tree', 'b.txt'), 'B');
};

const putDeepTree = async (granted: string): Promise<void> => {
  await put(join(granted, 'tree', 'a', 'one.txt'), '1');
  await put(join(granted, 'tree', 'two.txt'), '2');
  await mkdir(join(granted, 'tree', 'empty'));
};

const withOpsWorld = (prefix: string): OpsWorld => {
  let current: OpsWorld | null = null;
  beforeEach(async () => {
    current = await openWorld(prefix);
    markOfTheWeb.mockReset();
    markOfTheWeb.mockResolvedValue();
  });
  afterEach(async () => {
    if (current !== null) await rm(current.base, { recursive: true, force: true });
  });
  return new Proxy({} as OpsWorld, { get: (_target, key) => current?.[key as keyof OpsWorld] });
};

export { dirLink, dots, makeAppDir, names, openWorld, put, putDeepTree, putPair, withOpsWorld };
export type { OpsWorld };
