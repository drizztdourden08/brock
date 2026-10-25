/* @layer electron-main @kind test */
import { mkdir, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { vi } from 'vitest';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import type { MainContext } from '../src/main/types/main-context.type';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { mainFolderMemory } from '../src/main/documents/main-folder-memory';
import { electronDialogMock } from './electron-dialog-mock';
import { makeBase, sessionOf, testAccess } from './folder-fixture';
import type { Call } from './folder-fixture';

interface GrantTree {
  base: string;
  assets: string;
  palettes: string;
}

interface GrantSessionInput {
  base: string;
  confirm: MainContext['dialogs']['confirm'];
  flags: MainContext['flags'];
  home?: string[];
  dialogs?: MainContext['dialogs'];
  log?: MainContext['log'];
}

interface GrantSession {
  access: DocumentAccess;
  call: Call;
}

const GRANT_PROFILES = { load: (id: string) => Promise.resolve(id === 'p1' ? { id, name: id, created: 1, lastPlayed: 1 } : null) } as MainContext['profiles'];

const makeGrantTree = async (prefix: string): Promise<GrantTree> => {
  const base = await makeBase(prefix);
  const assets = join(base, 'proj', 'assets');
  const palettes = join(base, 'proj', 'palettes');
  await mkdir(join(assets, 'inner'), { recursive: true });
  await mkdir(palettes, { recursive: true });
  await writeFile(join(assets, 'hero.json'), '{}');
  await writeFile(join(assets, 'side.json'), '{}');
  await writeFile(join(palettes, 'warm.pal'), 'warm');
  return { base, assets, palettes };
};

const flagsOf = (argv: string[]): MainContext['flags'] => {
  const real = createAutomationFlags();
  return {
    ...real,
    isAutomationLaunch: () => real.isAutomationLaunch(argv),
    isHeadlessLaunch: () => real.isHeadlessLaunch(argv),
    hasFlag: (flag) => real.hasFlag(flag, argv),
    flagValue: (flag) => real.flagValue(flag, argv),
  };
};

const grantSession = ({ base, confirm, flags, home = [], dialogs, log = () => undefined }: GrantSessionInput): GrantSession => {
  const paths: MainContext['paths'] = { userData: (...segments) => join(base, 'user', ...segments), data: (...segments) => join(base, 'Data', ...segments) };
  const access: DocumentAccess = testAccess({
    sensitiveRoots: () => ({ home, trees: [] }),
    memory: () => mainFolderMemory({ paths, log: () => undefined, profiles: GRANT_PROFILES, documents: access }),
  });
  const call = sessionOf({
    documents: access,
    paths,
    profiles: GRANT_PROFILES,
    log,
    dialogs: dialogs ?? { confirm },
    flags,
    product: { name: 'Bxel' } as MainContext['product'],
  });
  return { access, call };
};

const openHero = (call: Call, assets: string, opts: unknown, profile?: string): Promise<unknown> => {
  electronDialogMock.dialog.showOpenDialog.mockResolvedValueOnce({ canceled: false, filePaths: [join(assets, 'hero.json')] });
  return call('document:open', opts, profile);
};

const reads = (access: DocumentAccess, path: string): Promise<boolean> => access.resolve(path).then(() => true, () => false);

type GrantDialogs = MainContext['dialogs'];

type GrantLog = MainContext['log'];

type ConfirmMock = ReturnType<typeof vi.fn<GrantDialogs['confirm']>>;

const confirmMock = (answer: boolean): ConfirmMock => vi.fn<GrantDialogs['confirm']>().mockResolvedValue(answer);

const removeTree = (base: string): Promise<void> => rm(base, { recursive: true, force: true });

export { confirmMock, flagsOf, grantSession, makeGrantTree, openHero, reads, removeTree };
export type { Call, ConfirmMock, DocumentAccess, GrantDialogs, GrantLog };
