/* @layer renderer-shell @kind logic */
import type { QuitDecision } from '@drizztdourden08/brock-core';
import { getAppLog } from '../log/get-app-log';
import type { BeforeQuit, OnBeforeQuit, QuitGuardRegistry } from './quit.type';

const guards = new Set<BeforeQuit>();
const asyncGuards = new Set<OnBeforeQuit>();
const listeners = new Set<() => void>();
let deciding: Promise<QuitDecision> | null = null;

const describe = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const ask = (guard: BeforeQuit): string[] => {
  try {
    const message = guard();
    return message ? [message] : [];
  } catch (error) {
    getAppLog().error(`beforeQuit threw: ${describe(error)}`);
    return [];
  }
};

const askAsync = async (guard: OnBeforeQuit): Promise<QuitDecision> => {
  try {
    return (await guard()) === 'stay' ? 'stay' : 'quit';
  } catch (error) {
    getAppLog().error(`onBeforeQuit failed, the app stays open: ${describe(error)}`);
    return 'stay';
  }
};

const runAll = async (): Promise<QuitDecision> => {
  for (const guard of [...asyncGuards]) {
    if ((await askAsync(guard)) === 'stay') return 'stay';
  }
  return 'quit';
};

const changed = (): void => {
  for (const listener of [...listeners]) listener();
};

const track = <T>(set: Set<T>, guard: T): (() => void) => {
  set.add(guard);
  changed();
  return () => {
    set.delete(guard);
    changed();
  };
};

const quitGuards: QuitGuardRegistry = {
  add: (guard) => track(guards, guard),
  addAsync: (guard) => track(asyncGuards, guard),
  count: () => guards.size + asyncGuards.size,
  subscribe: (listener) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  messages: () => [...guards].flatMap(ask),
  decide: () => {
    deciding ??= runAll().finally(() => { deciding = null; });
    return deciding;
  },
};

export { quitGuards };
