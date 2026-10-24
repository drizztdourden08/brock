/* @layer electron-main @kind logic */
import { resolveDataDir } from './data-dir';
import type { RunServerOptions, ServerRuntime } from './run-server.type';

const setProcessExitCode = (code: number): void => {
  process.exitCode = code;
};

const serverRuntimeOf = (options: RunServerOptions<unknown>): ServerRuntime => {
  const argv = options.argv ?? process.argv.slice(2);
  return {
    argv,
    dataDir: resolveDataDir(argv, options.env ?? process.env, options.cwd ?? process.cwd()),
    stdout: options.stdout ?? process.stdout,
    stderr: options.stderr ?? process.stderr,
    signals: options.signals ?? process,
    now: options.now ?? Date.now,
    setExitCode: options.setExitCode ?? setProcessExitCode,
  };
};

export { serverRuntimeOf };
