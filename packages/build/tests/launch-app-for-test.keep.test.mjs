/* @layer tooling-scripts @kind test */
import { existsSync } from 'node:fs';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as testing from '../src/testing/index.mjs';
import { tempTree } from './temp-tree.mjs';

const launches = vi.hoisted(() => ({ args: [] }));

vi.mock('../src/testing/assert-launchable.mjs', () => ({ assertLaunchable: () => 'dist/electron/main.js' }));
vi.mock('../src/run.mjs', () => ({ resolveElectronBinary: () => 'electron' }));
vi.mock('../src/testing/load-electron-driver.mjs', () => ({
  loadElectronDriver: async () => ({
    launch: async ({ args }) => {
      launches.args = args;
      const index = { url: () => 'file:///app/dist/renderer/index.html', waitForLoadState: async () => undefined };
      return { windows: () => [index], process: () => ({}), close: async () => undefined };
    },
  }),
}));

const tree = tempTree('brock-launch-');
afterEach(() => tree.cleanup());

describe('launchAppForTest', () => {
  it('starts on a fresh temporary profile and removes it on close', async () => {
    const launched = await testing.launchAppForTest({ appDir: '.' });
    expect(launches.args).toContain(`--user-data=${launched.userData}`);
    expect(existsSync(launched.userData)).toBe(true);
    await launched.close();
    expect(existsSync(launched.userData)).toBe(false);
  });

  it('starts on the app profile it is given, with its fixtures, and leaves it in place on close', async () => {
    const profile = tree.tempDir();
    tree.put(profile, 'profiles/default/settings.json', '{}');
    const launched = await testing.launchAppForTest({ appDir: '.', userData: profile });
    expect(launched.userData).toBe(profile);
    expect(launches.args).toContain(`--user-data=${profile}`);
    await launched.close();
    expect(existsSync(profile)).toBe(true);
  });

  it('exports waitForAppPage and pageKindOf, so a test never takes the splash from firstWindow()', () => {
    expect(typeof testing.waitForAppPage).toBe('function');
    expect(testing.pageKindOf('file:///app/dist/renderer/splash.html')).toBe('splash');
  });
});
