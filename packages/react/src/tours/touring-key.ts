/* @layer renderer-shell @kind logic */
const touringHolds = (event: Pick<KeyboardEvent, 'key' | 'altKey'>, touring: boolean): boolean =>
  touring && !(event.altKey && event.key === 'Enter');

export { touringHolds };
