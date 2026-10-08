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
  id: 'relic-of-the-past',
  name: 'Relic of the Past',
  protocols: [{ scheme: 'relic-of-the-past' }],
  fileAssociations: [
    { ext: 'msul', name: 'Music Pack', progId: 'RelicOfThePast.MusicPack', mimeType: 'application/x-msul' },
    { ext: 'RSP', name: 'Character <Sprite>', progId: 'RelicOfThePast.SpritePack' },
  ],
};

const EXE = 'C:\\Users\\me\\AppData\\Local\\relic-of-the-past\\current\\Relic of the Past.exe';
const CLASSES = 'HKCU\\Software\\Classes';

const homes: string[] = [];
afterEach(() => {
  for (const home of homes.splice(0)) rmSync(home, { recursive: true, force: true });
  refreshed.length = 0;
});

describe('Windows registry', () => {
  it('writes the deep link scheme and each file type under the user classes', () => {
    const entries = windowsRegistryEntries(PRODUCT, EXE, (ext) => `icon:${ext}`);
    expect(entries).toContainEqual({ key: `${CLASSES}\\relic-of-the-past`, name: 'URL Protocol', value: '' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\relic-of-the-past`, name: null, value: 'URL:Relic of the Past' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\relic-of-the-past\\shell\\open\\command`, name: null, value: `"${EXE}" "%1"` });
    expect(entries).toContainEqual({ key: `${CLASSES}\\.msul`, name: null, value: 'RelicOfThePast.MusicPack' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\.msul`, name: 'Content Type', value: 'application/x-msul' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\.rsp\\OpenWithProgids`, name: 'RelicOfThePast.SpritePack', value: '' });
    expect(entries).toContainEqual({ key: `${CLASSES}\\RelicOfThePast.SpritePack\\DefaultIcon`, name: null, value: 'icon:rsp' });
    expect(entries.some((entry) => entry.key === `${CLASSES}\\.rsp` && entry.name === 'Content Type')).toBe(false);
  });

  it('removes only what it wrote, leaving other programs on the same extension', () => {
    expect(windowsRegistryRemovals(PRODUCT)).toEqual([
      { key: `${CLASSES}\\relic-of-the-past`, name: null },
      { key: `${CLASSES}\\.msul\\OpenWithProgids`, name: 'RelicOfThePast.MusicPack' },
      { key: `${CLASSES}\\RelicOfThePast.MusicPack`, name: null },
      { key: `${CLASSES}\\.rsp\\OpenWithProgids`, name: 'RelicOfThePast.SpritePack' },
      { key: `${CLASSES}\\RelicOfThePast.SpritePack`, name: null },
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
    writeFileSync(join(resources, 'file-icons', 'msul.ico'), '');
    const iconOf = fileIconOf(EXE, resources);
    expect(iconOf('msul')).toBe(join(resources, 'file-icons', 'msul.ico'));
    expect(iconOf('rsp')).toBe(`"${EXE}",0`);
  });
});

describe('Linux desktop entry', () => {
  it('lists the file types and the scheme handler, with a quoted Exec', () => {
    const entry = linuxDesktopEntry(PRODUCT, '/home/me/Relic "1".AppImage');
    expect(entry).toContain('Exec="/home/me/Relic \\"1\\".AppImage" %U');
    expect(entry).toContain('MimeType=application/x-msul;application/x-rsp;x-scheme-handler/relic-of-the-past;');
  });

  it('describes each file type with an escaped comment and a glob', () => {
    const xml = linuxMimeXml(PRODUCT) ?? '';
    expect(xml).toContain('<mime-type type="application/x-rsp">');
    expect(xml).toContain('<comment>Character &lt;Sprite&gt;</comment>');
    expect(xml).toContain('<glob pattern="*.rsp"/>');
    expect(linuxMimeXml({ ...PRODUCT, fileAssociations: [] })).toBeNull();
  });

  it('writes both files under the home folder and refreshes the databases only when they change', async () => {
    const home = mkdtempSync(join(tmpdir(), 'brock-home-'));
    homes.push(home);
    await installLinuxIntegration(PRODUCT, '/opt/relic.AppImage', home);
    const desktop = join(home, '.local', 'share', 'applications', 'relic-of-the-past.desktop');
    expect(readFileSync(desktop, 'utf8')).toContain('x-scheme-handler/relic-of-the-past');
    expect(readFileSync(join(home, '.local', 'share', 'mime', 'packages', 'relic-of-the-past.xml'), 'utf8')).toContain('*.msul');
    expect(refreshed).toEqual(['update-desktop-database', 'update-mime-database']);
    await installLinuxIntegration(PRODUCT, '/opt/relic.AppImage', home);
    expect(refreshed).toHaveLength(2);
  });
});
