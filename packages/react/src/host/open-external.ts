/* @layer renderer-shell @kind logic */
const openExternal = (url: string): void => {
  window.open(url, '_blank', 'noopener');
};

export { openExternal };
