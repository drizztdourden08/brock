/* @layer electron-main @kind logic */
const refusePrivateFile = (file: string, why: string): Error => new Error(`${file} ${why}; the bridge refuses it.`);

export { refusePrivateFile };
