/* @layer renderer-shell @kind logic */
const delay = (ms: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, ms); });

export { delay };
