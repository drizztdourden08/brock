/* @layer renderer-shell @kind logic */
const NO_BADGE = (): null => null;

const promptFor = (packName: string, trashable: boolean) => ({
  title: 'Delete Music Pack',
  message: `Delete pack "${packName}"? ${trashable ? 'It goes to the Recycle Bin.' : 'This cannot be undone.'}`,
});

export { NO_BADGE, promptFor };
