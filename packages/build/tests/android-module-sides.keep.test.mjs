/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { androidModules } from '../src/platforms/android/android-modules.mjs';
import { capacitorConfig } from '../src/platforms/android/capacitor-config.mjs';
import { modulePlugins } from '../src/platforms/android/module-plugins.mjs';
import { sdkPackagesCheck } from '../src/platforms/doctor/sdk-packages-check.mjs';

const MODULES_DIR = resolve(import.meta.dirname, '../../modules');
const moduleAt = (id) => {
  const dir = join(MODULES_DIR, id);
  return { dir, manifest: JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).brock };
};
const INPUT = moduleAt('input');
const DISPLAY = moduleAt('display');
const UPDATER = moduleAt('updater');

const scratch = mkdtempSync(join(tmpdir(), 'brock-android-modules-'));
let count = 0;

const writeInto = (root, [file, text]) => {
  const target = join(root, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, text);
};

const app = (files) => {
  count += 1;
  const root = join(scratch, `app-${count}`);
  Object.entries(files).forEach((entry) => writeInto(root, entry));
  return root;
};

afterAll(() => {
  rmSync(scratch, { recursive: true, force: true });
});

const PACKAGE = JSON.stringify({ dependencies: { '@capacitor/core': '^8.4.0', '@drizztdourden08/brock-input': '*', '@drizztdourden08/brock-display': '*' } });
const CONFIG = { product: { appId: 'dev.brock.check', name: 'Brock Check' } };
const capacitorJson = (rootDir, modules) => JSON.parse(capacitorConfig({ rootDir, config: { ...CONFIG, modules }, modules: [] }).content);

describe('K1 the module Android sides in the scaffold', { tags: ['critical'] }, () => {
  it('names the modules that ship an Android side by their Gradle project', () => {
    expect(androidModules([INPUT, DISPLAY, UPDATER])).toEqual([
      { id: 'input', project: 'drizztdourden08-brock-input' },
      { id: 'display', project: 'drizztdourden08-brock-display' },
    ]);
  });

  it('leaves a Brock module out of the Gradle project when it is installed but not in modules', () => {
    const rootDir = app({ 'package.json': PACKAGE });
    expect(capacitorJson(rootDir, ['input', 'display']).android.includePlugins).toBeUndefined();
    expect(capacitorJson(rootDir, ['input']).android.includePlugins).toEqual(['@capacitor/core', '@drizztdourden08/brock-input']);
  });

  it('waits for cap add android, then skips a project that already includes the modules', async () => {
    const step = modulePlugins();
    expect((await step.run({ rootDir: app({ 'package.json': PACKAGE }), config: CONFIG, modules: [INPUT, DISPLAY] })).status).toBe('pending');
    const settings = "include ':drizztdourden08-brock-input'\ninclude ':drizztdourden08-brock-display'\n";
    const wired = app({ 'package.json': PACKAGE, 'mobile/android/capacitor.settings.gradle': settings });
    expect(await step.run({ rootDir: wired, config: CONFIG, modules: [INPUT, DISPLAY] })).toEqual({ status: 'skipped', detail: 'input, display already wired' });
    expect((await step.run({ rootDir: wired, config: CONFIG, modules: [UPDATER] })).status).toBe('skipped');
  });

  it('asks the doctor for the NDK and CMake the input module builds with', () => {
    const sdk = app({ 'platform-tools/x': '', 'platforms/android-36/x': '', 'build-tools/36.0.0/x': '' });
    const result = sdkPackagesCheck().run({ env: { ANDROID_HOME: sdk }, modules: [INPUT, DISPLAY] });
    expect(result.status).toBe('missing');
    expect(result.install).toBe('sdkmanager "ndk;27.2.12479018" "cmake;3.22.1"');
    expect(sdkPackagesCheck().run({ env: { ANDROID_HOME: sdk }, modules: [DISPLAY] }).status).toBe('ok');
  });
});
