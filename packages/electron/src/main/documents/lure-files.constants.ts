/* @layer electron-main @kind constants */
const LURE_EXTENSIONS: ReadonlySet<string> = new Set(['.lnk', '.url', '.scf', '.library-ms', '.searchconnector-ms']);

const LURE_NAMES: ReadonlySet<string> = new Set(['desktop.ini', 'autorun.inf']);

export { LURE_EXTENSIONS, LURE_NAMES };
