/* @layer core @kind logic */
import { serverCandidates } from '../address/server-candidates';
import type { ClientState } from './client-state.type';

const connectCandidates = (state: ClientState): string[] => {
  if (state.workingUrl !== null) return [state.workingUrl];
  const { connection } = state;
  if (connection === null) return [];
  return [...new Set([...serverCandidates(connection.url), ...serverCandidates(connection.fallbackUrl ?? '')])];
};

export { connectCandidates };
