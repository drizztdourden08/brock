/* @layer core @kind logic */
import { createOnlineRoom } from '../room/create-online-room';
import type { ClientKit } from './client-kit.type';
import { handleSaveSwap } from './handle-save-swap';
import type { LinkController } from './link-controller.type';
import type { OnlineConnection } from './online-host.type';
import type { OnlineContext } from './online-context.type';

const startConnection = (
  kit: ClientKit,
  controller: LinkController,
  context: OnlineContext,
  connection: OnlineConnection,
): void => {
  const { state, deps } = kit;
  controller.close();
  Object.assign(kit.room, createOnlineRoom());
  Object.assign(state, {
    connection,
    stopped: false,
    failed: false,
    everConnected: false,
    closeReason: '',
    workingUrl: null,
  });
  kit.network.reset();
  deps.host.arm();
  kit.deathLinks.set(connection.deathLink);
  state.unsubscribeSwap = deps.host.onSaveSwap(() => handleSaveSwap(context));
  if (deps.host.goalReached()) kit.goal.report();
  controller.begin();
};

export { startConnection };
