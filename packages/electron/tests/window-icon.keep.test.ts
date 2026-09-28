/* @layer electron-main @kind test */
import { join, resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { findWindowIcon } from '../src/main/window/find-window-icon';
import { logosDirs } from '../src/main/window/logos-dirs';
import { appUserModelId } from '../src/main/instance/app-user-model-id';

const SOURCE = '/app/public/logos';
const SHIPPED = '/app/dist/renderer/logos';
const DIRS = [SOURCE, SHIPPED];
const having = (...paths: string[]) => (path: string): boolean => paths.includes(path);

describe('findWindowIcon', () => {
  it('prefers the ico on Windows and the png elsewhere', () => {
    const exists = having(join(SHIPPED, 'icon.ico'), join(SHIPPED, 'icon-256.png'));
    expect(findWindowIcon({ dirs: DIRS, platform: 'win32', instanceName: null, exists }).path).toBe(join(SHIPPED, 'icon.ico'));
    expect(findWindowIcon({ dirs: DIRS, platform: 'linux', instanceName: null, exists }).path).toBe(join(SHIPPED, 'icon-256.png'));
  });

  it('takes the first folder that has the file', () => {
    const exists = having(join(SOURCE, 'icon-256.png'), join(SHIPPED, 'icon-256.png'));
    expect(findWindowIcon({ dirs: DIRS, platform: 'linux', instanceName: null, exists }).path).toBe(join(SOURCE, 'icon-256.png'));
  });

  it('gives a named instance the bot icon', () => {
    const exists = having(join(SHIPPED, 'icon.ico'), join(SHIPPED, 'icon-bot.ico'));
    const result = findWindowIcon({ dirs: DIRS, platform: 'win32', instanceName: 'probe', exists });
    expect(result.path).toBe(join(SHIPPED, 'icon-bot.ico'));
    expect(result.warnings).toEqual([]);
  });

  it('falls back to the app icon with a warning when the bot icon is missing', () => {
    const result = findWindowIcon({ dirs: DIRS, platform: 'win32', instanceName: 'probe', exists: having(join(SHIPPED, 'icon.ico')) });
    expect(result.path).toBe(join(SHIPPED, 'icon.ico'));
    expect(result.warnings).toHaveLength(1);
  });

  it('warns when no icon exists at all', () => {
    const result = findWindowIcon({ dirs: DIRS, platform: 'win32', instanceName: null, exists: having() });
    expect(result.path).toBeUndefined();
    expect(result.warnings).toHaveLength(1);
  });
});

describe('logosDirs', () => {
  const renderer = resolve('/app/dist/renderer/index.html');

  it('reads the shipped renderer folder in a packaged build', () => {
    expect(logosDirs(renderer, false)).toEqual([resolve('/app/dist/renderer/logos')]);
  });

  it('puts the source public folder first in dev', () => {
    expect(logosDirs(renderer, true)).toEqual([resolve('/app/public/logos'), resolve('/app/dist/renderer/logos')]);
  });
});

describe('appUserModelId', () => {
  it('is the product appId, or its instance form', () => {
    expect(appUserModelId('com.example.app', null)).toBe('com.example.app');
    expect(appUserModelId('com.example.app', 'probe')).toBe('com.example.app.instance.probe');
  });
});
