/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { addonPathsOf, cmakeDirOf } from '../ensure-addon/index.mjs';

const PACKAGE_DIR = resolve('work', 'deep', 'node_modules', 'brock-input');
const OTHER_DIR = resolve('work', 'other', 'node_modules', 'brock-input');

describe('the CMake build folder of the addon', () => {
  it('stays inside the package when the option is not set', () => {
    const paths = addonPathsOf(PACKAGE_DIR, 'win32-x64', {});
    expect(paths.cmakeDir).toBeNull();
    expect(paths.sdlBuildDir).toBe(join(PACKAGE_DIR, 'native', 'third_party', 'build-win32-x64'));
    expect(paths.addonBuildDir).toBe(join(PACKAGE_DIR, 'native', 'third_party', 'addon-build-win32-x64'));
    expect(cmakeDirOf(PACKAGE_DIR, { BROCK_INPUT_CMAKE_DIR: '  ' })).toBeNull();
  });

  it('moves both build trees under a given folder, one subfolder per package copy', () => {
    const short = resolve('b');
    const paths = addonPathsOf(PACKAGE_DIR, 'win32-x64', { BROCK_INPUT_CMAKE_DIR: short });
    expect(paths.cmakeDir).toMatch(new RegExp(`^${short.replace(/\\/g, '\\\\')}[\\\\/][0-9a-f]{8}$`));
    expect(paths.sdlBuildDir).toBe(join(paths.cmakeDir ?? '', 'sdl-win32-x64'));
    expect(paths.addonBuildDir).toBe(join(paths.cmakeDir ?? '', 'addon-win32-x64'));
    expect(cmakeDirOf(OTHER_DIR, { BROCK_INPUT_CMAKE_DIR: short })).not.toBe(paths.cmakeDir);
    expect(cmakeDirOf(PACKAGE_DIR, { BROCK_INPUT_CMAKE_DIR: short })).toBe(paths.cmakeDir);
  });

  it('takes temp for the system temp folder', () => {
    const dir = cmakeDirOf(PACKAGE_DIR, { BROCK_INPUT_CMAKE_DIR: 'temp' });
    expect(dir?.startsWith(join(tmpdir(), 'brock-input'))).toBe(true);
  });

  it('keeps the downloads, the source and the install inside the package', () => {
    const paths = addonPathsOf(PACKAGE_DIR, 'win32-x64', { BROCK_INPUT_CMAKE_DIR: 'temp' });
    expect(paths.installDir).toBe(join(PACKAGE_DIR, 'native', 'third_party', 'install', 'win32-x64'));
    expect(paths.downloadsDir).toBe(join(PACKAGE_DIR, 'native', 'third_party', 'downloads'));
  });

  it('gives the Android library build the same option', () => {
    const gradle = readFileSync(resolve(import.meta.dirname, '../android/build.gradle'), 'utf8');
    expect(gradle).toContain("findProperty('brockInputCmakeDir')");
    expect(gradle).toContain("System.getenv('BROCK_INPUT_CMAKE_DIR')");
    expect(gradle).toContain('buildStagingDirectory = cmakeStagingDir');
  });
});
