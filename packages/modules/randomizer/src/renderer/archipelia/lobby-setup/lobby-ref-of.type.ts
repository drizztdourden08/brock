/* @layer renderer-shell @kind types */
import type { LobbyRef } from '../../../archipelago/lobby';
import type { LobbyDraft } from './lobby-draft.type';

type RefStrategy = (draft: LobbyDraft) => LobbyRef | null;

export type { RefStrategy };
