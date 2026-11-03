/* @layer core @kind test */
import { delimiter, join } from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';
import { afterEach, describe, expect, it } from 'vitest';
import { emsdkEnvOf } from '../ensure-wasm/index.mjs';
import { scratchDirs } from './fakes/scratch-dirs';

const scratch = scratchDirs('port-kit-env-');

afterEach(scratch.clean);

const fakeSdk = (binary: string): string => {
  const dir = scratch.make();
  mkdirSync(join(dir, 'upstream', 'emscripten'), { recursive: true });
  mkdirSync(join(dir, 'node', '16.20.0_64bit', 'bin'), { recursive: true });
  writeFileSync(join(dir, 'node', '16.20.0_64bit', 'bin', binary), '');
  writeFileSync(join(dir, '.emscripten'), '');
  return dir;
};

describe('K1 emsdkEnvOf', { tags: ['critical'] }, () => {
  it('sets EMSDK, the node binary and the config, and puts the SDK dirs first on PATH', () => {
    const dir = fakeSdk('node');
    const env = emsdkEnvOf(dir, { PATH: '/usr/bin' }, 'linux');
    expect(env.EMSDK).toBe(dir);
    expect(env.EMSDK_NODE).toBe(join(dir, 'node', '16.20.0_64bit', 'bin', 'node'));
    expect(env.EM_CONFIG).toBe(join(dir, '.emscripten'));
    expect(env.EMSDK_PYTHON).toBeUndefined();
    expect(env.PATH).toBe([dir, join(dir, 'upstream', 'emscripten'), join(dir, 'node', '16.20.0_64bit', 'bin'), '/usr/bin'].join(delimiter));
  });

  it('keeps the Path key on Windows, adds the python folder, and never makes a second key', () => {
    const dir = fakeSdk('node.exe');
    mkdirSync(join(dir, 'python', '3.9.2-nuget_64bit'), { recursive: true });
    writeFileSync(join(dir, 'python', '3.9.2-nuget_64bit', 'python.exe'), '');
    const env = emsdkEnvOf(dir, { Path: 'C:\\Windows' }, 'win32');
    expect(Object.keys(env).filter((key) => key.toLowerCase() === 'path')).toEqual(['Path']);
    expect(env.Path).toBe([dir, join(dir, 'upstream', 'emscripten'), join(dir, 'node', '16.20.0_64bit', 'bin'), join(dir, 'python', '3.9.2-nuget_64bit'), 'C:\\Windows'].join(delimiter));
    expect(env.EMSDK_NODE).toBe(join(dir, 'node', '16.20.0_64bit', 'bin', 'node.exe'));
    expect(env.EMSDK_PYTHON).toBe(join(dir, 'python', '3.9.2-nuget_64bit', 'python.exe'));
  });

  it('skips the parts the SDK folder does not hold', () => {
    const dir = scratch.make();
    const env = emsdkEnvOf(dir, { PATH: '/usr/bin' }, 'linux');
    expect(env).toEqual({ PATH: [dir, '/usr/bin'].join(delimiter), EMSDK: dir });
  });
});
