/* @layer core @kind logic */
import { connectTags } from '../handshake/connect-tags';
import { ITEMS_HANDLING_ALL } from '../handshake/handshake.constants';
import type { ArchipelagoSession } from './archipelago-session.type';
import { buildOnlineContext } from './build-online-context';
import type { ClientDeps } from './client-deps.type';
import { createCheckReporter } from './create-check-reporter';
import { createClientKit } from './create-client-kit';
import { createLinkController } from './create-link-controller';
import { startConnection } from './start-connection';

const createArchipelagoClient = (deps: ClientDeps): ArchipelagoSession => {
  const kit = createClientKit(deps);
  const controller = createLinkController(kit, () => context);
  const context = buildOnlineContext(kit, controller);
  const checks = createCheckReporter(kit);

  return {
    ...checks,
    connect: (connection) => startConnection(kit, controller, context, connection),
    close: controller.close,
    say: (text) => kit.send({ cmd: 'Say', text }),
    setDeathLink(on) {
      kit.deathLinks.set(on);
      if (context.isLive()) {
        context.send({ cmd: 'ConnectUpdate', items_handling: ITEMS_HANDLING_ALL, tags: connectTags(on) });
      }
    },
    status: () => kit.network.status(),
    messages: () => kit.messages.messages,
    subscribe(f) {
      const offNetwork = kit.network.subscribe(f);
      const offMessages = kit.messages.onChange(() => f());
      return () => {
        offNetwork();
        offMessages();
      };
    },
    onEvent: (f) => kit.events.add(f),
  };
};

export { createArchipelagoClient };
