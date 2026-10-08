/* @layer tooling-scripts @kind test */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { androidPlatform } from '../src/platforms/android/android.platform.mjs';
import { capacitorConfigScripts } from '../src/platforms/android/capacitor-config-scripts.mjs';

const made = [];

const app = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'brock-capacitor-config-'));
  made.push(root);
  for (const [file, text] of Object.entries(files)) writeFileSync(join(root, file), text);
  return root;
};

afterEach(() => {
  for (const root of made.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe('the Android scaffold and a capacitor.config.ts', () => {
  it('fails while a script config sits beside the managed JSON, since Capacitor reads it first', () => {
    const rootDir = app({ 'capacitor.config.ts': 'export default {};\n', 'capacitor.config.json': '{}\n' });
    const outcome = capacitorConfigScripts().run({ rootDir, config: {}, modules: [] });
    expect(outcome.status).toBe('failed');
    expect(outcome.detail).toContain('capacitor.config.ts sits beside the managed capacitor.config.json');
    expect(outcome.detail).toContain('docs/upgrading-an-app.md');
  });

  it('passes over an app with only the managed config, and runs first', () => {
    expect(capacitorConfigScripts().run({ rootDir: app({ 'capacitor.config.json': '{}\n' }), config: {}, modules: [] }).status).toBe('skipped');
    expect(androidPlatform.scaffold[0].name).toBe(capacitorConfigScripts().name);
  });
});
