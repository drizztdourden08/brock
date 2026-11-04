/* @layer renderer-shell @kind logic */
import { useSessionStore } from './behavior/useSessionStore';

const stopActiveSession = (): void => {
  const { session, setSession, setStatus } = useSessionStore.getState();
  if (session === null) return;
  setSession(null);
  session.stop();
  setStatus('idle');
};

export { stopActiveSession };
