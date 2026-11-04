/* @layer renderer-shell @kind hook */
import type { ArchipelagoClient } from '../../../../archipelago';
import { useSessionStore } from '../../../../session';
import type { OnlineSessionView } from '../online-session.type';

const useOnlineClient = (): ArchipelagoClient | null =>
  useSessionStore((state) => (state.session as OnlineSessionView | null)?.client ?? null);

export { useOnlineClient };
