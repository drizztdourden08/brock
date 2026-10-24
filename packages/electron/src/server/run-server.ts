/* @layer electron-main @kind logic */
import { mkdirSync } from 'fs';
import { runHealthCommand } from './health-command';
import { HEALTH_COMMAND } from './run-server.constants';
import type { RunServerOptions, ServerRunHandle } from './run-server.type';
import type { RunningServer, ServerStart } from './server-host.type';
import { serverRuntimeOf } from './server-runtime';
import { startHeartbeat } from './start-heartbeat';
import { createStdoutLog } from './stdout-log';
import { createStopServer } from './stop-server';

const runServer = async <TDomains = undefined>(
  start: ServerStart<TDomains>,
  options: RunServerOptions<TDomains> = {},
): Promise<ServerRunHandle | null> => {
  const { argv, dataDir, stdout, stderr, signals, now, setExitCode } = serverRuntimeOf(options);

  if (argv.find((arg) => !arg.startsWith('-')) === HEALTH_COMMAND) {
    setExitCode(runHealthCommand({ dataDir, now: now(), print: (line) => stdout.write(`${line}\n`) }));
    return null;
  }

  const log = createStdoutLog(stdout, stderr);
  mkdirSync(dataDir, { recursive: true });
  log(`starting, data folder ${dataDir}`);
  let running: RunningServer;
  try {
    running = await start({ dataDir, args: argv, log, domains: options.domains?.(dataDir) });
  } catch (error) {
    log(`the server did not start: ${error instanceof Error ? (error.stack ?? error.message) : String(error)}`, 'error');
    setExitCode(1);
    return null;
  }
  const heartbeat = await startHeartbeat({ dataDir, health: running.health, log, now, intervalMs: options.heartbeatMs, hold: options.holdProcess });
  const stop = createStopServer({ running, heartbeat, log, setExitCode });
  signals.once('SIGTERM', () => void stop());
  signals.once('SIGINT', () => void stop());
  log('started');
  return { dataDir, stop };
};

export { runServer };
