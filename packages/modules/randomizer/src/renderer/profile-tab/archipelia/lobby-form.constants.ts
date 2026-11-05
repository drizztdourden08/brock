/* @layer renderer-shell @kind constants */
import { EMPTY_LOBBY_DRAFT } from '../../archipelia/lobby-setup';
import type { LobbyForm } from './lobby-form.type';

const INITIAL_LOBBY_FORM: LobbyForm = { lobby: EMPTY_LOBBY_DRAFT, lobbyCheck: { kind: 'idle' } };

export { INITIAL_LOBBY_FORM };
