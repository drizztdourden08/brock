/* @layer renderer-shell @kind logic */
import { bindDeveloperTools } from '../../developer-tools/bind-developer-tools';
import type { DeveloperToolsBinding } from '../../developer-tools/developer-tools.type';
import { settle } from '../dom/settle';

const withDeveloperTools = async (run: (switchTo: (on: boolean) => Promise<void>) => Promise<void>): Promise<void> => {
  const listeners = new Set<() => void>();
  const state = { on: true };
  const binding: DeveloperToolsBinding = {
    get: () => state.on,
    set: (on) => {
      state.on = on;
      for (const listener of listeners) listener();
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
  const unbind = bindDeveloperTools(binding);
  const switchTo = async (on: boolean): Promise<void> => {
    binding.set(on);
    await settle();
  };
  try {
    await settle();
    await run(switchTo);
  } finally {
    unbind();
  }
};

export { withDeveloperTools };
