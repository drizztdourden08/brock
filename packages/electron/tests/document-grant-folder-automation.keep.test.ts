/* @layer electron-main @kind test */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rm } from 'fs/promises';
import { join } from 'path';
import type { MainContext } from '../src/main/types/main-context.type';
import type { DocumentAccess } from '../src/main/documents/document-access.type';
import { createDialogs } from '../src/main/dialogs/create-dialogs';
import { electronDialogMock } from './electron-dialog-mock';
import type { Call } from './folder-fixture';
import { flagsOf, grantSession, makeGrantTree, openHero, reads } from './folder-grant-fixture';

vi.mock('electron', async () => (await import('./electron-dialog-mock')).electronDialogMock);

const ANSWER = '--answer-folder-grants';
const OPT_IN = { grantFolder: { ask: true, showOnAutomation: true } };

let base = '';
let assets = '';
let access: DocumentAccess;
let call: Call;
let confirm: ReturnType<typeof vi.fn<MainContext['dialogs']['confirm']>>;
let log: ReturnType<typeof vi.fn<MainContext['log']>>;

const launch = (argv: string[], dialogs?: MainContext['dialogs']): void => {
  ({ access, call } = grantSession({ base, confirm, log, dialogs, flags: flagsOf(argv) }));
};

const openFile = (opts: unknown): Promise<unknown> => openHero(call, assets, opts, 'p1');

beforeEach(async () => {
  ({ base, assets } = await makeGrantTree('brock-grant-folder-auto-'));
  confirm = vi.fn<MainContext['dialogs']['confirm']>().mockResolvedValue(false);
  log = vi.fn<MainContext['log']>();
  electronDialogMock.app.isPackaged = false;
  electronDialogMock.dialog.showOpenDialog.mockReset();
  electronDialogMock.dialog.showMessageBox.mockReset();
  electronDialogMock.dialog.showMessageBox.mockResolvedValue({ response: 0 });
});

afterEach(async () => {
  electronDialogMock.app.isPackaged = true;
  await rm(base, { recursive: true, force: true });
});

describe('the folder question in an automation launch', () => {
  it('still declines by default and shows nothing', async () => {
    launch(['--no-focus']);
    expect(await openFile({ grantFolder: 'ask' })).toMatchObject({ folderGranted: false });
    expect(confirm).not.toHaveBeenCalled();
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
  });

  it('shows the native question on a plain --no-focus launch when the call opts in', async () => {
    launch(['--no-focus'], createDialogs({ flags: flagsOf(['--no-focus']), window: () => null, log }));
    expect(await openFile(OPT_IN)).toEqual({ path: join(assets, 'hero.json'), folderGranted: true, folder: assets });
    expect(electronDialogMock.dialog.showMessageBox).toHaveBeenCalledTimes(1);
    expect(await reads(access, join(assets, 'side.json'))).toBe(true);
  });

  it.each([['--review'], ['--screenshot=boot'], ['--screenshot-splash']])('refuses the opted-in question on %s', async (flag) => {
    const argv = ['--no-focus', flag];
    launch(argv, createDialogs({ flags: flagsOf(argv), window: () => null, log }));
    expect(await openFile(OPT_IN)).toMatchObject({ folderGranted: false });
    expect(electronDialogMock.dialog.showMessageBox).not.toHaveBeenCalled();
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
  });

  it('passes the opt-in to the dialog only when the call sets it', async () => {
    launch(['--no-focus']);
    await openFile(OPT_IN);
    expect(confirm.mock.calls[0]?.[0].showOnAutomation).toBe(true);
    await openFile({ grantFolder: { ask: true } });
    expect(confirm).toHaveBeenCalledTimes(1);
  });
});

describe(ANSWER, () => {
  it('grants the same folder a human yes would, without showing a dialog', async () => {
    launch(['--no-focus', `${ANSWER}=grant`]);
    expect(await openFile({ grantFolder: 'ask' })).toEqual({ path: join(assets, 'hero.json'), folderGranted: true, folder: assets });
    expect(confirm).not.toHaveBeenCalled();
    expect(electronDialogMock.dialog.showMessageBox).not.toHaveBeenCalled();
    expect(await access.rememberedFolders('p1')).toEqual([]);
    expect(await reads(access, join(assets, 'side.json'))).toBe(true);
  });

  it('keeps the widening rules: levels and refused roots apply as for a human yes', async () => {
    launch(['--no-focus', `${ANSWER}=grant`]);
    expect(await openFile({ grantFolder: { ask: true, levels: 1 } })).toMatchObject({ folderGranted: true, folder: join(base, 'proj') });
    expect(await openFile({ grantFolder: { ask: true, levels: 9 } })).toMatchObject({ folderGranted: true, folder: base });
  });

  it('declines on decline', async () => {
    launch(['--no-focus', `${ANSWER}=decline`]);
    expect(await openFile({ grantFolder: 'ask' })).toMatchObject({ folderGranted: false });
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
  });

  it('does not remember a folder it granted, so a dev run leaves nothing for the installed app', async () => {
    launch(['--no-focus', `${ANSWER}=grant`]);
    expect(await openFile({ grantFolder: 'ask' })).toMatchObject({ folderGranted: true });
    expect(await access.rememberedFolders('p1')).toEqual([]);
  });

});

describe(`${ANSWER} refusals and edge cases`, () => {
  it('is ignored with an identity flag alone, which is an automation launch but not a headless one', async () => {
    launch(['--profile=x', `${ANSWER}=grant`]);
    expect(await openFile({ grantFolder: 'ask' })).toMatchObject({ folderGranted: false });
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
    expect(log).toHaveBeenCalledWith(expect.stringContaining(ANSWER));
  });

  it('answers folderGranted false when reading the flag throws', async () => {
    const hasFlag = (): never => {
      throw new Error('flags broke');
    };
    ({ access, call } = grantSession({ base, confirm, log, flags: { ...flagsOf(['--no-focus', `${ANSWER}=grant`]), hasFlag } }));
    expect(await openFile({ grantFolder: 'ask' })).toEqual({ path: join(assets, 'hero.json'), folderGranted: false, reason: 'flags broke' });
  });

  it('grants nothing when the app asks for no folder', async () => {
    launch(['--no-focus', `${ANSWER}=grant`]);
    expect(await openFile({})).toBe(join(assets, 'hero.json'));
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
  });

  it('refuses a bad option even with the flag', async () => {
    launch(['--no-focus', `${ANSWER}=grant`]);
    expect(await openFile({ grantFolder: { ask: false } })).toMatchObject({ folderGranted: false });
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
  });

  it('is ignored and logged once in a packaged app', async () => {
    electronDialogMock.app.isPackaged = true;
    launch(['--no-focus', `${ANSWER}=grant`]);
    expect(await openFile({ grantFolder: 'ask' })).toMatchObject({ folderGranted: false });
    expect(await openFile({ grantFolder: 'ask' })).toMatchObject({ folderGranted: false });
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
    expect(log.mock.calls.filter(([message]) => message.includes(ANSWER))).toHaveLength(1);
  });

  it('is ignored on a launch that is not an automation launch, and the human question is asked', async () => {
    launch([`${ANSWER}=grant`]);
    expect(await openFile({ grantFolder: 'ask' })).toMatchObject({ folderGranted: false });
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
    expect(log).toHaveBeenCalledWith(expect.stringContaining(ANSWER));
  });

  it('is ignored for a value it does not know', async () => {
    launch(['--no-focus', `${ANSWER}=yes`]);
    expect(await openFile({ grantFolder: 'ask' })).toMatchObject({ folderGranted: false });
    expect(await reads(access, join(assets, 'side.json'))).toBe(false);
  });
});
