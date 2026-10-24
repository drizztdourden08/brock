/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { createBuilderConfig } from '../src/builder-config.mjs';

const { tempDir, cleanup } = tempTree('brock-fuses-');
afterEach(cleanup);

const PRODUCT = { id: 'packs', appId: 'com.example.packs', name: 'Packs', author: { name: 'Someone' }, icons: {}, protocols: [], fileAssociations: [] };

const fusesOf = (options) => createBuilderConfig(PRODUCT, { rootDir: tempDir(), ...options }).electronFuses;

describe('electron fuses of the builder config', () => {
  it('turns off NODE_OPTIONS and the inspect flags, and turns on the asar and cookie fuses', () => {
    expect(fusesOf({ platform: 'win32' })).toEqual({
      runAsNode: false,
      enableNodeOptionsEnvironmentVariable: false,
      enableNodeCliInspectArguments: false,
      onlyLoadAppFromAsar: true,
      enableEmbeddedAsarIntegrityValidation: true,
      enableCookieEncryption: true,
    });
  });

  it('checks the asar integrity on Windows and macOS, and leaves it off on Linux, where Electron has none', () => {
    expect(fusesOf({ platform: 'darwin' }).enableEmbeddedAsarIntegrityValidation).toBe(true);
    expect(fusesOf({ platform: 'linux' }).enableEmbeddedAsarIntegrityValidation).toBe(false);
    expect(fusesOf({ platform: 'linux' }).onlyLoadAppFromAsar).toBe(true);
  });

  it('keeps RunAsNode on exactly when the app declares helpers', () => {
    expect(fusesOf({}).runAsNode).toBe(false);
    expect(fusesOf({ helpers: {} }).runAsNode).toBe(false);
    expect(fusesOf({ helpers: { 'packs-mcp': 'src/helper/main.ts' } }).runAsNode).toBe(true);
  });

  it('keeps the hidden folders of a linked package out of the asar, whose files must not change while it is written', () => {
    expect(createBuilderConfig(PRODUCT, { rootDir: tempDir() }).files).toContain('!**/node_modules/**/.*/**');
  });

  it('lets an app without helpers turn RunAsNode on, and refuses it off beside helpers', () => {
    expect(fusesOf({ fuses: { runAsNode: true } }).runAsNode).toBe(true);
    expect(fusesOf({ fuses: { runAsNode: false } }).runAsNode).toBe(false);
    expect(fusesOf({ helpers: { a: 'a.ts' }, fuses: { runAsNode: true } }).runAsNode).toBe(true);
    expect(() => fusesOf({ helpers: { a: 'a.ts' }, fuses: { runAsNode: false } })).toThrow(/fuses\.runAsNode is false, but helpers are declared/);
  });
});
