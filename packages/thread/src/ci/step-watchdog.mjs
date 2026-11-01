/* @layer tooling-scripts @kind logic */

/**
 * @param {{ child: { pid?: number }, timeoutMs: number, stop: (child: object) => void, onTimeout?: () => void, setTimer?: Function, clearTimer?: Function }} request
 * @returns {{ state: { timedOut: boolean }, cancel: () => void }} stops the child's tree once when the time is up
 */
const watchStep = ({ child, timeoutMs, stop, onTimeout = () => {}, setTimer = setTimeout, clearTimer = clearTimeout }) => {
  const state = { timedOut: false };
  const handle = setTimer(() => {
    state.timedOut = true;
    stop(child);
    onTimeout();
  }, timeoutMs);
  return { state, cancel: () => clearTimer(handle) };
};

export { watchStep };
