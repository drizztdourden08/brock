/* @layer renderer-shell @kind logic */
const watchCoreCrash = (onCrash: (message: string) => void): (() => void) => {
  const handleError = (event: ErrorEvent): void => {
    if (!(event.error instanceof WebAssembly.RuntimeError)) return;
    event.preventDefault();
    onCrash(`The core crashed: ${event.error.message}`);
  };
  window.addEventListener('error', handleError);
  return () => window.removeEventListener('error', handleError);
};

export { watchCoreCrash };
