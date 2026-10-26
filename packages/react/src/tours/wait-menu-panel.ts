/* @layer renderer-shell @kind logic */
import { SUB_MENU_POLL_MS, SUB_MENU_WAIT_MS } from './tours.constants';

const pause = (): Promise<void> => new Promise((resolve) => { setTimeout(resolve, SUB_MENU_POLL_MS); });

const waitMenuPanel = async (probe: () => HTMLElement | null, signal: AbortSignal): Promise<HTMLElement | null> => {
  const deadline = performance.now() + SUB_MENU_WAIT_MS;
  let panel = probe();
  while (!panel && !signal.aborted && performance.now() < deadline) {
    await pause();
    panel = probe();
  }
  return panel;
};

export { waitMenuPanel };
