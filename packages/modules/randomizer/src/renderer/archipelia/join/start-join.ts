/* @layer renderer-shell @kind logic */
import { isKitError } from '@drizztdourden08/archipelia-client-kit';
import { joinLobby } from '../../../archipelago/lobby';
import { pickBuild } from '../builds/pick-build';
import { clientInfoOf } from '../client-info/client-info-of';
import { archipeliaOf } from '../game/archipelia-of';
import { createMainSocket } from '../socket/create-main-socket';
import { loadBuildsIndex } from '../world-package/load-builds-index';
import { worldPackageFor } from '../world-package/world-package-for';
import { joinConfigOf } from './join-config-of';
import type { StartJoinInput, StartJoinResult } from './join-input.type';

const startJoin = async (input: StartJoinInput): Promise<StartJoinResult> => {
  const { server, lobby, ap, config, seat, token } = input;
  const build = pickBuild((await loadBuildsIndex())?.builds ?? [], ap);
  const bytes = await worldPackageFor(ap);
  if (build === null || bytes === null) return { error: `The bundled build for Archipelago ${ap} is missing.` };
  const client = await clientInfoOf();
  try {
    const { slotName, yaml } = archipeliaOf().archipelia.playerFile(config, client.version);
    return { session: joinLobby(joinConfigOf({ server, lobby, ap, slotName, yaml, build, bytes: new Uint8Array(bytes), client, seat, token }), { createSocket: createMainSocket }) };
  } catch (failure) {
    if (isKitError(failure)) return { error: failure.message };
    throw failure;
  }
};

export { startJoin };
