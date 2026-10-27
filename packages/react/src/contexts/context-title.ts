/* @layer renderer-shell @kind logic */
const contextTitle = (title: string, label: string | undefined): string => (label === undefined ? title : `${title}, ${label}`);

export { contextTitle };
