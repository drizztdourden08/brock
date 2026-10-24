/* @layer electron-main @kind types */
import type { MainContext } from '../types/main-context.type';
import type { DomainsFactory, RunningServer } from '../../server/server-host.type';

type EmbedServerContext = Pick<MainContext, 'paths'>;

interface EmbedServerOptions<TDomains = undefined> {
  domains?: DomainsFactory<TDomains>;
  args?: readonly string[];
}

interface EmbeddedServer {
  dataDir: string;
  stop: () => Promise<void>;
  health: RunningServer['health'];
}

export type { EmbedServerContext, EmbedServerOptions, EmbeddedServer };
