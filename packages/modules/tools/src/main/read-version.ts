/* @layer electron-main @kind logic */
import type { ToolProbeResult, ToolRunResult } from './tools-main.type';
import { VERSION_PATTERN } from './tools-main.constants';

const readVersion = (output: ToolRunResult): ToolProbeResult => {
  if (output.timedOut) return { ok: false, version: null, error: 'it did not answer in time' };
  if (output.code !== 0) return { ok: false, version: null, error: `it exited with code ${output.code ?? 'none'}` };
  return { ok: true, version: VERSION_PATTERN.exec(`${output.stdout}\n${output.stderr}`)?.[0] ?? null };
};

export { readVersion };
