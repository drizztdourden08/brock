/* @layer renderer-shell @kind logic */
const installLabel = (installing: boolean, error: string | null): string => {
  if (installing) return 'Fetching...';
  return error === null ? 'Get the tool' : 'Try the download again';
};

export { installLabel };
