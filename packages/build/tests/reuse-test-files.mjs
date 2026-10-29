/* @layer tooling-scripts @kind test */
import { readdirSync, statSync, utimesSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, beforeEach } from 'vitest';

const HOUR = 3_600_000;

const SETTLED = new Date(Date.now() - 2 * HOUR);

const settleDirs = (dir) => {
  utimesSync(dir, SETTLED, SETTLED);
  for (const entry of readdirSync(dir)) if (statSync(join(dir, entry)).isDirectory()) settleDirs(join(dir, entry));
};

const age = (root, path, ms = 2 * HOUR) => {
  const when = new Date(Date.now() - ms);
  utimesSync(join(root, path), when, when);
  settleDirs(root);
};

const useDevelopmentMode = (cleanup) => {
  beforeEach(() => {
    process.env.NODE_ENV_ELECTRON_VITE = 'development';
  });
  afterEach(() => {
    delete process.env.NODE_ENV_ELECTRON_VITE;
    cleanup();
  });
};

const reuseLogger = () => {
  const messages = [];
  const quiet = () => undefined;
  const customLogger = { info: (message) => messages.push(message), warn: quiet, warnOnce: quiet, error: quiet, clearScreen: quiet, hasErrorLogged: () => false, hasWarned: false };
  return { messages, customLogger };
};

const writeMainApp = (put, root) => {
  put(root, 'package.json', '{"name":"app","type":"module"}');
  put(root, 'electron/main.js', "import { greet } from './greet.js';\nconsole.log(greet());\n");
  put(root, 'electron/greet.js', "export const greet = () => 'hello one';\n");
};

export { age, HOUR, reuseLogger, useDevelopmentMode, writeMainApp };
