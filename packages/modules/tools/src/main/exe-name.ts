/* @layer electron-main @kind logic */
const exeName = (binary: string, platform: NodeJS.Platform = process.platform): string => (platform === 'win32' ? `${binary}.exe` : binary);

export { exeName };
