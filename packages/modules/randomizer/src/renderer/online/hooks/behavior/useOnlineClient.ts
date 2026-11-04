/* @layer renderer-shell @kind hook */
import type { ArchipelagoClient } from '../../../../archipelago';
import { useSessionStore } from '../../../../session';

const useOnlineClient = (): ArchipelagoClient | null =>
  useSessionStore((state) => state.session?.client ?? null);

export { useOnlineClient };
