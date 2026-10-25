/* @layer renderer-shell @kind logic */
const nonEmpty = (value: string | undefined): string | undefined => (value === '' ? undefined : value);

export { nonEmpty };
