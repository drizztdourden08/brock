/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { externalProtocols } from '../src/main/window/external-protocols';
import { openExternal } from '../src/main/window/open-external';

const opened = vi.hoisted(() => [] as string[]);

vi.mock('electron', () => ({ shell: { openExternal: (url: string) => { opened.push(url); return Promise.resolve(); } } }));
vi.mock('../src/main/logs/append-main-log', () => ({ appendMainLog: () => {} }));

beforeEach(() => {
  opened.length = 0;
  externalProtocols.allowed = new Set(['http:', 'https:', 'mailto:']);
});

describe('openExternal', () => {
  it('opens an allowed link and refuses other protocols and broken links', async () => {
    expect(await openExternal('https://archipelago.gg/rooms')).toBe(true);
    expect(await openExternal('file:///C:/Windows/system32/calc.exe')).toBe(false);
    expect(await openExternal('not a url')).toBe(false);
    expect(opened).toEqual(['https://archipelago.gg/rooms']);
  });

  it('follows the app allow list', async () => {
    externalProtocols.allowed = new Set(['steam:']);
    expect(await openExternal('steam://run/123')).toBe(true);
    expect(await openExternal('https://example.com')).toBe(false);
  });
});
