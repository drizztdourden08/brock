/* @layer tooling-scripts @kind logic */
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { resolveElectronBinary } from '../run.mjs';
import { assertLaunchable } from './assert-launchable.mjs';
import { loadElectronDriver } from './load-electron-driver.mjs';
import { FIRST_WINDOW_TIMEOUT_MS, HEADLESS_ARGS, OUTPUT_TAIL } from './testing.constants.mjs';

const captureOutput = (app) => {
  const output = [];
  const keep = (chunk) => output.push(String(chunk));
  app.process().stdout?.on('data', keep);
  app.process().stderr?.on('data', keep);
  return () => output.join('').slice(-OUTPUT_TAIL);
};

const cleanEnv = (env) => {
  const next = { ...process.env, ...env };
  delete next.ELECTRON_RUN_AS_NODE;
  return next;
};

const firstPage = async (app, timeout, outputOf) => {
  try {
    const page = await app.firstWindow({ timeout });
    await page.waitForLoadState('domcontentloaded');
    return page;
  } catch (error) {
    await app.close();
    throw new Error(`${error instanceof Error ? error.message : String(error)}\nmain output:\n${outputOf()}`, { cause: error });
  }
};

/**
 * @param {{ appDir: string, args?: string[], env?: Record<string, string>, timeoutMs?: number }} options
 * @returns {Promise<{ app: any, page: any, userData: string, close: () => Promise<void> }>}
 */
const launchAppForTest = async ({ appDir, args = [], env = {}, timeoutMs = FIRST_WINDOW_TIMEOUT_MS }) => {
  const root = resolve(appDir);
  const main = assertLaunchable(root);
  const driver = await loadElectronDriver(root);
  const userData = mkdtempSync(join(tmpdir(), 'brock-e2e-'));
  const app = await driver.launch({
    executablePath: resolveElectronBinary(root),
    args: [main, ...HEADLESS_ARGS, `--user-data=${userData}`, ...args],
    cwd: root,
    env: cleanEnv(env),
  });
  const page = await firstPage(app, timeoutMs, captureOutput(app)).catch((error) => {
    rmSync(userData, { recursive: true, force: true });
    throw error;
  });
  const close = async () => {
    await app.close();
    rmSync(userData, { recursive: true, force: true });
  };
  return { app, page, userData, close };
};

export { launchAppForTest };
