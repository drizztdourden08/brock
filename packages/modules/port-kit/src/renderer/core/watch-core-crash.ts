/* @layer renderer-shell @kind logic */
import type { CoreCrash } from './game-core.type';

const watchCoreCrash = (onCrash: (crash: CoreCrash) => void, armDelayMs = 0): (() => void) => {
  let armed = armDelayMs <= 0;
  let crashed = false;
  const timer = armed ? null : setTimeout(() => { armed = true; }, armDelayMs);
  const handleError = (event: ErrorEvent): void => {
    const error: unknown = event.error;
    if (!(error instanceof WebAssembly.RuntimeError)) return;
    event.preventDefault();
    if (!armed || crashed) return;
    crashed = true;
    onCrash({ message: `The core crashed: ${error.message}`, error, event });
  };
  window.addEventListener('error', handleError);
  return () => {
    if (timer !== null) clearTimeout(timer);
    window.removeEventListener('error', handleError);
  };
};

export { watchCoreCrash };
