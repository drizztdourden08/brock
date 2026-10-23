/* @layer renderer-shell @kind logic */
import type { QuitDecision } from '@drizztdourden08/brock-core';
import { getAppLog } from '../log/get-app-log';
import type { BeforeQuit, OnBeforeQuit, QuitGuardRegistry } from './quit.type';

const guards = new Set<BeforeQuit>();
const asyncGuards = new Set<OnBeforeQuit>();
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

const quitGuards: QuitGuardRegistry = {
  add: (guard) => {
    guards.add(guard);
    return () => { guards.delete(guard); };
  },
  addAsync: (guard) => {
    asyncGuards.add(guard);
    return () => { asyncGuards.delete(guard); };
  },
  messages: () => [...guards].flatMap(ask),
  decide: () => {
    deciding ??= runAll().finally(() => { deciding = null; });
    return deciding;
  },
};

export { quitGuards };
