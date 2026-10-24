/* @layer electron-main @kind test */
import { mkdir, mkdtemp, realpath, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import type { BrowserWindow } from 'electron';
import { expect } from 'vitest';
import type { MainContext } from '../src/main/types/main-context.type';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { documentHandlers } from '../src/main/documents/ipc-handlers';

type Handler = (event: unknown, ...args: unknown[]) => unknown;
type Call = (channel: string, ...args: unknown[]) => Promise<unknown>;

interface Tree {
  base: string;
  granted: string;
  outside: string;
}

const makeBase = async (prefix: string): Promise<string> => realpath(await mkdtemp(join(tmpdir(), prefix)));

const makeTree = async (prefix: string): Promise<Tree> => {
  const base = await makeBase(prefix);
  const tree = { base, granted: join(base, 'granted'), outside: join(base, 'outside') };
  await mkdir(join(tree.granted, 'sub'), { recursive: true });
  await mkdir(tree.outside);
  await writeFile(join(tree.granted, 'sub', 'in.txt'), 'inside');
  await writeFile(join(tree.outside, 'secret.txt'), 'secret');
  return tree;
};

const knownProfiles = { load: (id: string) => Promise.resolve({ id, name: id, created: 1, lastPlayed: 1 }) } as MainContext['profiles'];

const refusedBy = (access: DocumentAccess) => (path: string): Promise<void> => expect(access.resolve(path)).rejects.toThrow(/may not use/);

const sessionOf = (given: Partial<MainContext>): Call => {
  const handlers = new Map<string, Handler>();
  const ctx: Partial<MainContext> = {
    profiles: knownProfiles,
    ...given,
    handle: ((channel: string, fn: Handler) => handlers.set(channel, fn)) as MainContext['handle'],
    window: () => ({}) as BrowserWindow,
  };
  documentHandlers.register(ctx as MainContext);
  return (channel, ...args) => Promise.resolve().then(() => handlers.get(channel)?.({}, ...args));
};

export { knownProfiles, makeBase, makeTree, refusedBy, sessionOf };
export type { Call };
