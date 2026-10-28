/* @layer renderer-shell @kind logic */
import { useCommandGates } from './useCommandGates';

const clearCommandGates = (key: string): void => {
  useCommandGates.setState((state) => {
    const { [key]: _gone, ...rest } = state.gates;
    const { [key]: _seen, ...views } = state.views;
    return { gates: rest, views };
  });
};

export { clearCommandGates };
