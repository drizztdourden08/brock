/* @layer electron-main @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fileIconOf } from '../src/main/os-integration/file-icon-of';
import { installLinuxIntegration } from '../src/main/os-integration/install-linux-integration';
import { linuxDesktopEntry } from '../src/main/os-integration/linux-desktop-entry';
import { linuxMimeXml } from '../src/main/os-integration/linux-mime-xml';
import { regArgs } from '../src/main/os-integration/reg-args';
import { windowsRegistryEntries } from '../src/main/os-integration/windows-registry-entries';
import { windowsRegistryRemovals } from '../src/main/os-integration/windows-registry-removals';
import type { OsIntegrationProduct } from '../src/main/os-integration/os-integration.type';

const refreshed = vi.hoisted(() => [] as string[]);
vi.mock('child_process', () => ({ execFile: (tool: string) => { refreshed.push(tool); } }));

const PRODUCT: OsIntegrationProduct = {
  id: 'my-app',
  name: 'My App',
  protocols: [{ scheme: 'my-app' }],
  fileAssociations: [
    { ext: 'mypack', name: 'Music Pack', progId: 'MyApp.Pack', mimeType: 'application/x-mypack' },
    { ext: 'MYSKIN', name: 'Character <Sprite>', progId: 'MyApp.Skin' },
  ],
};

const EXE = 'C:\\Users\\me\\AppData\\Local\\my-app\\current\\My App.exe';
const CLASSES = 'HKCU\\Software\\Classes';

const homes: string[] = [];
afterEach(() => {
  for (const home of homes.splice(0)) rmSync(home, { recursive: true, force: true });
  refreshed.length = 0;
});

describe('Windows registry', () => {
  it('writes the deep link scheme and each file type under the user classes', () => {
    const entries = windowsRegistryEntries(PRODUCT, EXE, (ext) => `icon:${ext}`);
    expect(entries).toContainEqual({ key: `${CLASSES}\\my-app`, name: 'URL Protocol', value: '' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\my-app`, name: null, value: 'URL:My App' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\my-app\\shell\\open\\command`, name: null, value: `"${EXE}" "%1"` });
    expect(entries).toContainEqual({ key: `${CLASSES}\\.mypack`, name: null, value: 'MyApp.Pack' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\.mypack`, name: 'Content Type', value: 'application/x-mypack' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\.myskin\\OpenWithProgids`, name: 'MyApp.Skin', value: '' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\MyApp.Skin\\DefaultIcon`, name: null, value: 'icon:myskin' });
    expect(entries.some((entry) => entry.key === `${CLASSES}\\.myskin` && entry.name === 'Content Type')).toBe(false);
  });

  it('removes only what it wrote, leaving other programs on the same extension', () => {
    expect(windowsRegistryRemovals(PRODUCT)).toEqual([
      { key: `${CLASSES}\\my-app`, name: null },
      { key: `${CLASSES}\\.mypack\\OpenWithProgids`, name: 'MyApp.Pack' },
      { key: `${CLASSES}\\MyApp.Pack`, name: null },
      { key: `${CLASSES}\\.myskin\\OpenWithProgids`, name: 'MyApp.Skin' },
      { key: `${CLASSES}\\MyApp.Skin`, name: null },
    ]);
  });

  it('turns each entry into reg.exe arguments', () => {
    expect(regArgs({ key: 'HKCU\\X', name: null, value: '"a" "%1"' })).toEqual(['add', 'HKCU\\X', '/ve', '/t', 'REG_SZ', '/d', '"a" "%1"', '/f']);
    expect(regArgs({ key: 'HKCU\\X', name: 'URL Protocol', value: '' })).toEqual(['add', 'HKCU\\X', '/v', 'URL Protocol', '/t', 'REG_SZ', '/d', '', '/f']);
    expect(regArgs({ key: 'HKCU\\X', name: null })).toEqual(['delete', 'HKCU\\X', '/f']);
    expect(regArgs({ key: 'HKCU\\X', name: 'P.Id' })).toEqual(['delete', 'HKCU\\X', '/v', 'P.Id', '/f']);
  });

  it('points a file type at its shipped icon, else at the executable', () => {
    const resources = mkdtempSync(join(tmpdir(), 'brock-icons-'));
    homes.push(resources);
    mkdirSync(join(resources, 'file-icons'));
    writeFileSync(join(resources, 'file-icons', 'mypack.ico'), '');
    const iconOf = fileIconOf(EXE, resources);
    expect(iconOf('mypack')).toBe(join(resources, 'file-icons', 'mypack.ico'));
    expect(iconOf('myskin')).toBe(`"${EXE}",0`);
  });
});

describe('Linux desktop entry', () => {
  it('lists the file types and the scheme handler, with a quoted Exec', () => {
    const entry = linuxDesktopEntry(PRODUCT, '/home/me/MyApp "1".AppImage');
    expect(entry).toContain('Exec="/home/me/MyApp \\"1\\".AppImage" %U');
    expect(entry).toContain('MimeType=application/x-mypack;application/x-myskin;x-scheme-handler/my-app;');
  });

  it('describes each file type with an escaped comment and a glob', () => {
    const xml = linuxMimeXml(PRODUCT) ?? '';
    expect(xml).toContain('<mime-type type="application/x-myskin">');
    expect(xml).toContain('<comment>Character &lt;Sprite&gt;</comment>');
    expect(xml).toContain('<glob pattern="*.myskin"/>');
    expect(linuxMimeXml({ ...PRODUCT, fileAssociations: [] })).toBeNull();
  });

  it('writes both files under the home folder and refreshes the databases only when they change', async () => {
    const home = mkdtempSync(join(tmpdir(), 'brock-home-'));
    homes.push(home);
    await installLinuxIntegration(PRODUCT, '/opt/my-app.AppImage', home);
    const desktop = join(home, '.local', 'share', 'applications', 'my-app.desktop');
    expect(readFileSync(desktop, 'utf8')).toContain('x-scheme-handler/my-app');
    expect(readFileSync(join(home, '.local', 'share', 'mime', 'packages', 'my-app.xml'), 'utf8')).toContain('*.mypack');
    expect(refreshed).toEqual(['update-desktop-database', 'update-mime-database']);
    await installLinuxIntegration(PRODUCT, '/opt/my-app.AppImage', home);
    expect(refreshed).toHaveLength(2);
  });
});
