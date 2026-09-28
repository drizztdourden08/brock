/* @layer electron-main @kind logic */
import type { StartupConfig, WindowSize } from './startup-config.type';

const parseWindowSize = (arg: string): WindowSize | null => {
  const [, width, height] = /^--window-size=(\d+)x(\d+)$/.exec(arg) ?? [];
  if (width === undefined || height === undefined) return null;
  return { width: parseInt(width, 10), height: parseInt(height, 10) };
};

const parseStartupConfig = (defaultSize: WindowSize, argv: readonly string[] = process.argv): StartupConfig => {
  let windowSize: WindowSize | null = null;
  let fresh = false;

  for (const arg of argv) {
    if (arg === '--window-size') { windowSize = defaultSize; continue; }
    const size = parseWindowSize(arg);
    if (size) { windowSize = size; continue; }
    if (arg === '--fresh') fresh = true;
  }

  return { windowSize, fresh };
};

export { parseStartupConfig };
