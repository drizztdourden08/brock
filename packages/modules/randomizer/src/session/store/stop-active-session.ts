/* @layer renderer-shell @kind logic */
import { useSessionStore } from './session-store';

const stopActiveSession = (): void => {
  const { session, setSession, setStatus } = useSessionStore.getState();
  if (session === null) return;
  setSession(null);
  session.stop();
  setStatus('idle');
};

export { stopActiveSession };
