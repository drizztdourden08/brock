/* @layer renderer-shell @kind logic */
import { lobbyInfo, lobbyInfoProblems } from '../../../archipelago/lobby';
import type { LobbyRef } from '../../../archipelago/lobby';
import { pickBuild } from '../builds/pick-build';
import { unsupportedVersionText } from '../builds/unsupported-version-text';
import { clientInfoOf } from '../client-info/client-info-of';
import { archipeliaOf } from '../game/archipelia-of';
import { formLabelsOf } from '../game/form-labels-of';
import { createMainSocket } from '../socket/create-main-socket';
import { loadBuildsIndex } from '../world-package/load-builds-index';
import { FORM_ERRORS, noBuildsIndexText } from './form-error.constants';
import { formErrorOf } from './form-error-of';
import type { LobbyCheck } from './lobby-check.type';

const errorOf = (text: string, code: string): LobbyCheck => ({ kind: 'error', text, code });

const checkLobby = async (server: string, ref: LobbyRef): Promise<LobbyCheck> => {
  const labels = formLabelsOf();
  const result = await lobbyInfo(server, ref, { createSocket: createMainSocket });
  if (!result.ok) return errorOf(formErrorOf(result.failure, server, labels, ref), result.failure.code);
  const { lobby } = result.info;
  const index = await loadBuildsIndex();
  if (index === null) return errorOf(noBuildsIndexText(labels.shortName), 'no-builds-index');
  const { builds } = index;
  const build = pickBuild(builds, lobby.engine.ap);
  if (build === null) return errorOf(unsupportedVersionText(lobby.engine.ap, builds, labels.shortName), 'unsupported-version');
  if (!lobby.joinable) return errorOf(FORM_ERRORS['lobby-locked'] ?? '', 'lobby-locked');
  const client = await clientInfoOf();
  const problem = lobbyInfoProblems(result.info, {
    client,
    archipelagoVersion: build.archipelagoVersion,
    worldVersion: archipeliaOf().archipelia.worldVersion,
    worldBytes: build.size,
    yamlBytes: [],
    game: labels.game,
  })[0];
  if (problem !== undefined) return errorOf(problem.message, problem.code);
  return { kind: 'ok', server, lobby: ref, name: lobby.name, ap: lobby.engine.ap, approval: lobby.admission === 'host-approval', seats: lobby.seats ?? [], ...(lobby.open === undefined ? {} : { open: lobby.open }), build };
};

export { checkLobby };
