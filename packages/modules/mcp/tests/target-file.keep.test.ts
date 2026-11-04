/* @layer core @kind test */
import { bridgeFileFor } from '@drizztdourden08/brock-electron/bridge';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { describe, expect, it } from 'vitest';
import { appDirOf } from '../src/helper/app-dir-of';
import { targetFileOf } from '../src/helper/target-file';

const appDir = resolve('some', 'app');
const none = { userData: null, instance: null, file: null };

describe('I-131 helper target file', { tags: ['standard'] }, () => {
  it('uses the bridge file as given, resolved against the app folder', () => {
    const file = resolve('elsewhere', 'bridge.json');
    expect(targetFileOf({ ...none, file }, { app: 'demo', appDir })).toBe(file);
    expect(targetFileOf({ ...none, file: 'rel.json' }, { app: null, appDir })).toBe(join(appDir, 'rel.json'));
  });

  it('resolves a relative user data folder against the app folder', () => {
    const expected = bridgeFileFor({ app: 'demo', userData: join(appDir, '.user-data') });
    expect(targetFileOf({ ...none, userData: '.user-data' }, { app: 'demo', appDir })).toBe(expected);
  });

  it('keeps an absolute user data folder', () => {
    const userData = resolve('abs', 'data');
    expect(targetFileOf({ ...none, userData }, { app: 'demo', appDir })).toBe(bridgeFileFor({ app: 'demo', userData }));
  });

  it('keys the file by instance and by default', () => {
    expect(targetFileOf({ ...none, instance: 'two' }, { app: 'demo', appDir })).toBe(bridgeFileFor({ app: 'demo', instance: 'two' }));
    expect(targetFileOf(none, { app: 'demo', appDir })).toBe(bridgeFileFor({ app: 'demo' }));
  });

  it('refuses to guess the app', () => {
    expect(() => targetFileOf(none, { app: null, appDir })).toThrow(/BROCK_BRIDGE_FILE/);
  });

  it('finds the app folder two levels above the helper file', () => {
    const helper = join(appDir, 'dist', 'helpers', 'brock-mcp.mjs');
    expect(appDirOf(pathToFileURL(helper).href)).toBe(appDir);
  });
});
