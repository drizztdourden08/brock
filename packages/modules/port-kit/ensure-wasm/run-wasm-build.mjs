/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { existsSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { emsdkOf } from './emsdk-of.mjs';

const withEmsdk = ({ dir, emscripten }) => {
  if (!emscripten) return process.env;
  return { ...process.env, EMSDK: dir, PATH: `${emscripten}${delimiter}${dir}${delimiter}${process.env.PATH ?? ''}` };
};

const runActivated = (root, script, { dir, activate }) => {
  const wrapper = join(tmpdir(), `port-kit-wasm-build-${process.pid}-${Date.now()}.bat`);
  writeFileSync(wrapper, `@echo off\r\ncall "${activate}" >nul\r\n"${process.execPath}" "${script}"\r\nexit /b %ERRORLEVEL%\r\n`);
  try {
    return spawnSync(process.env.ComSpec ?? process.env.COMSPEC ?? 'cmd.exe', ['/d', '/c', wrapper], {
      cwd: root, stdio: 'inherit', windowsHide: true, env: { ...process.env, EMSDK: dir },
    });
  } finally {
    rmSync(wrapper, { force: true });
  }
};

/**
 * @param {string} root
 * @param {import('./index.d.mts').WasmOptions} wasm
 * @param {import('./index.d.mts').EmsdkInfo} [sdk]
 * @returns {void}
 */
const runWasmBuild = (root, wasm, sdk = emsdkOf(root, wasm)) => {
  const script = join(root, wasm.buildScript);
  if (!existsSync(script)) throw new Error(`No core build script at ${script}.`);
  const result = sdk.activate
    ? runActivated(root, script, sdk)
    : spawnSync(process.execPath, [script], { cwd: root, stdio: 'inherit', env: withEmsdk(sdk) });
  if (result.status !== 0) throw new Error(`The core build exited with ${result.status ?? result.signal}.`);
};

export { runWasmBuild };
