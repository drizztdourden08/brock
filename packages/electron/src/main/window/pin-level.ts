/* @layer electron-main @kind logic */
const pinLevel = (platform: NodeJS.Platform): 'floating' | 'pop-up-menu' => (platform === 'win32' ? 'pop-up-menu' : 'floating');

export { pinLevel };
