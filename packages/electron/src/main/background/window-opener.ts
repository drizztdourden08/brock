/* @layer electron-main @kind logic */
const windowOpener: { current: (() => Promise<void>) | null } = { current: null };

export { windowOpener };
