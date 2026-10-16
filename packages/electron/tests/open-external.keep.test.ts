/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { externalProtocols } from '../src/main/window/external-protocols';
import { guardNavigation } from '../src/main/window/navigation-guard';
import type { NavigatingContents } from '../src/main/window/navigation-guard.type';
import { navigationVerdict } from '../src/main/window/navigation-verdict';
import { openExternal } from '../src/main/window/open-external';

const opened = vi.hoisted(() => [] as string[]);

vi.mock('electron', () => ({ shell: { openExternal: (url: string) => { opened.push(url); return Promise.resolve(); } } }));
vi.mock('../src/main/logs/append-main-log', () => ({ appendMainLog: () => {} }));

const DEV = 'http://localhost:24200/index.html';
const PACKAGED = 'file:///C:/Apps/Example/resources/app.asar/dist/renderer/index.html';
const WEB = new Set(['http:', 'https:', 'mailto:']);

type Listener = (event: { preventDefault: () => void }, url: string) => void;

const fakeContents = (current: string): { contents: NavigatingContents, navigate: (url: string) => boolean } => {
  let listener: Listener = () => {};
  const contents: NavigatingContents = { getURL: () => current, on: (_name, fn) => { listener = fn; } };
  const navigate = (url: string): boolean => {
    let prevented = false;
    listener({ preventDefault: () => { prevented = true; } }, url);
    return prevented;
  };
  return { contents, navigate };
};

beforeEach(() => {
  opened.length = 0;
  externalProtocols.allowed = new Set(WEB);
});

describe('openExternal', () => {
  it('opens an allowed link and refuses other protocols and broken links', async () => {
    expect(await openExternal('https://example.org/rooms')).toBe(true);
    expect(await openExternal('file:///C:/Windows/system32/calc.exe')).toBe(false);
    expect(await openExternal('not a url')).toBe(false);
    expect(opened).toEqual(['https://example.org/rooms']);
  });

  it('follows the app allow list', async () => {
    externalProtocols.allowed = new Set(['steam:']);
    expect(await openExternal('steam://run/123')).toBe(true);
    expect(await openExternal('https://example.com')).toBe(false);
  });
});

describe('navigationVerdict', () => {
  it('keeps the page on a dev server reload, the same origin and a hash change', () => {
    expect(navigationVerdict(DEV, DEV, WEB)).toBe('stay');
    expect(navigationVerdict(DEV, 'http://localhost:24200/', WEB)).toBe('stay');
    expect(navigationVerdict(DEV, `${DEV}#/settings`, WEB)).toBe('stay');
    expect(navigationVerdict(PACKAGED, `${PACKAGED}?screen=home#top`, WEB)).toBe('stay');
  });

  it('blocks a dropped file and every page outside the app that is not a web link', () => {
    expect(navigationVerdict(PACKAGED, 'file:///C:/Users/someone/Desktop/photo.png', WEB)).toBe('block');
    expect(navigationVerdict(DEV, 'file:///C:/Users/someone/Desktop/notes.txt', WEB)).toBe('block');
    expect(navigationVerdict(DEV, 'data:text/html,hello', WEB)).toBe('block');
    expect(navigationVerdict(DEV, 'not a url', WEB)).toBe('block');
  });

  it('sends a web link, or another port of localhost, to the system browser', () => {
    expect(navigationVerdict(DEV, 'https://example.org/docs', WEB)).toBe('external');
    expect(navigationVerdict(DEV, 'http://localhost:5000/', WEB)).toBe('external');
    expect(navigationVerdict(PACKAGED, 'mailto:someone@example.org', WEB)).toBe('external');
    expect(navigationVerdict(PACKAGED, 'mailto:someone@example.org', new Set(['https:']))).toBe('block');
  });
});

describe('guardNavigation', () => {
  it('cancels a navigation that leaves the page and opens a web link outside the app', () => {
    const { contents, navigate } = fakeContents(PACKAGED);
    guardNavigation(contents);
    expect(navigate(`${PACKAGED}#/about`)).toBe(false);
    expect(navigate('file:///C:/Users/someone/Desktop/photo.png')).toBe(true);
    expect(navigate('https://example.org/docs')).toBe(true);
    expect(opened).toEqual(['https://example.org/docs']);
  });
});
