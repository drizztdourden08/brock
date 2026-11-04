/* @layer core @kind types */
type SessionStatus = 'idle' | 'starting' | 'active' | 'reconnecting' | 'error';

interface RandomizerSession {
  kind: string;
  status: SessionStatus;
  start(): Promise<void>;
  stop(): void;
  reportCheck(key: string): void;
}

export type { SessionStatus, RandomizerSession };
