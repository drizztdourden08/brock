/* @layer electron-main @kind logic */
import { shell } from 'electron';
import type { DeviceSignInOptions, SignInBegin, SignInPoll, SignInResult } from '../secrets.type';
import type { CodeListener, DeviceSignIn } from './device-sign-in.type';
import { CANCELLED, DEFAULT_POLL_MS, DEFAULT_TTL_MS, DENIED, EXPIRED } from './device-sign-in.constants';

const sleep = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => { clearTimeout(timer); resolve(); }, { once: true });
  });

const isAborted = (signal: AbortSignal): boolean => signal.aborted;

const failure = (err: unknown): SignInResult => ({
  ok: false,
  reason: 'error',
  message: err instanceof Error ? err.message : String(err),
});

const settle = async (answer: SignInPoll, onToken: DeviceSignInOptions['onToken']): Promise<SignInResult | null> => {
  if (answer.status === 'confirmed' && answer.token) {
    await onToken(answer.token);
    return { ok: true };
  }
  if (answer.status === 'denied') return DENIED;
  if (answer.status === 'expired' || answer.status === 'used') return EXPIRED;
  return null;
};

const pollUntilSettled = async (options: DeviceSignInOptions, started: SignInBegin, signal: AbortSignal): Promise<SignInResult> => {
  const { poll, onToken, pollMs = DEFAULT_POLL_MS, ttlMs = DEFAULT_TTL_MS } = options;
  const deadline = Date.now() + ttlMs;
  while (Date.now() < deadline) {
    await sleep(pollMs, signal);
    if (isAborted(signal)) return CANCELLED;
    const answer = await poll(started.id, started.pollSecret);
    if (isAborted(signal)) return CANCELLED;
    const settled = await settle(answer, onToken);
    if (settled) return settled;
  }
  return EXPIRED;
};

const createDeviceSignIn = (options: DeviceSignInOptions): DeviceSignIn => {
  const { begin, openUrl = (url: string) => shell.openExternal(url) } = options;
  let current: AbortController | null = null;

  const run = async (onCode: CodeListener): Promise<SignInResult> => {
    current?.abort();
    const controller = new AbortController();
    current = controller;
    try {
      const started = await begin();
      if (controller.signal.aborted) return CANCELLED;
      onCode(started.userCode, started.verifyUrl);
      await openUrl(started.verifyUrl);
      return await pollUntilSettled(options, started, controller.signal);
    } catch (err) {
      return controller.signal.aborted ? CANCELLED : failure(err);
    } finally {
      if (current === controller) current = null;
    }
  };

  const cancel = (): void => {
    current?.abort();
    current = null;
  };

  return { begin: run, cancel, isRunning: () => current !== null };
};

export { createDeviceSignIn };
