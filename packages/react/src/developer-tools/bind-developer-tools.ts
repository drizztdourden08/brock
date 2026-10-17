/* @layer renderer-shell @kind logic */
import type { DeveloperToolsBinding } from './developer-tools.type';
import { useDeveloperToolsStore } from './useDeveloperToolsStore';

const pull = (binding: DeveloperToolsBinding): void => {
  const { binding: current, on } = useDeveloperToolsStore.getState();
  const next = binding.get();
  if (current === binding && on !== next) useDeveloperToolsStore.setState({ on: next });
};

const bindDeveloperTools = (binding: DeveloperToolsBinding): (() => void) => {
  const previous = useDeveloperToolsStore.getState().binding;
  useDeveloperToolsStore.setState({ binding, on: binding.get() });
  const off = binding.subscribe(() => pull(binding));
  return () => {
    off();
    if (useDeveloperToolsStore.getState().binding !== binding) return;
    useDeveloperToolsStore.setState({ binding: previous, on: previous?.get() ?? false });
  };
};

export { bindDeveloperTools };
