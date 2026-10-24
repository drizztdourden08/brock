/* @layer electron-main @kind logic */
import { app } from 'electron';
import { appendMainLog } from '../logs/append-main-log';
import type { DomainsFactory, ServerLog, ServerStart } from '../../server/server-host.type';
import type { EmbeddedServer, EmbedServerContext, EmbedServerOptions } from './embed-server.type';

const embedServer = async <TDomains = undefined>(
  start: ServerStart<TDomains>,
  ctx: EmbedServerContext,
  options: EmbedServerOptions<TDomains> = {},
): Promise<EmbeddedServer> => {
  const dataDir = ctx.paths.userData();
  const log: ServerLog = (message, level = 'info') => appendMainLog(level, message);
  const domains: DomainsFactory<TDomains> | undefined = options.domains;
  const running = await start({ dataDir, args: options.args ?? [], log, domains: domains?.(dataDir) });
  let stopping: Promise<void> | null = null;
  const stop = (): Promise<void> => {
    stopping ??= Promise.resolve()
      .then(() => running.stop())
      .catch((error: unknown) => log(`the embedded server did not stop: ${String(error)}`, 'error'));
    return stopping;
  };
  app.once('will-quit', () => void stop());
  log('the embedded server started');
  return { dataDir, stop, health: running.health };
};

export { embedServer };
