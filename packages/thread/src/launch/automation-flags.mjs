/* @layer tooling-scripts @kind logic */
const HEADLESS_FLAGS = ['--no-focus', '--muted'];

const visibleFlags = (sound) => ['--visible', sound ? '--sound' : '--muted'];

/**
 * @param {{ visible: boolean, sound: boolean }} request
 * @returns {string[]}
 */
const automationFlags = ({ visible, sound }) => (visible ? visibleFlags(sound) : [...HEADLESS_FLAGS]);

export { automationFlags };
