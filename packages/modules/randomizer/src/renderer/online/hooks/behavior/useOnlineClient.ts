/* @layer renderer-shell @kind hook */
import type { ArchipelagoClient } from '../../../../archipelago';
import { useSessionStore } from '../../../../session/store/behavior/useSessionStore';
import type { OnlineSessionView } from '../online-session.type';

const useOnlineClient = (): ArchipelagoClient | null =>
  useSessionStore((state) => {
    const session: OnlineSessionView | null = state.session;
    return session?.client ?? null;
  });

export { useOnlineClient };
