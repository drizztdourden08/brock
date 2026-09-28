/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { WIN_ARCH } from './addon.constants.mjs';

const windowsArgs = (paths, libusbVersion) => {
  const arch = WIN_ARCH[process.arch];
  if (!arch) throw new Error(`Unsupported Windows arch: ${process.arch}`);
  const libusbDir = join(paths.thirdPartyDir, `libusb-${libusbVersion}`);
  return ['-A', arch.cmakePlatform, `-DLibUSB_INCLUDE_PATH=${join(libusbDir, 'include')}`, `-DLibUSB_LIBRARY=${join(libusbDir, arch.libusbDir, 'dll', 'libusb-1.0.lib')}`];
};

/**
 * @param {string} sourceDir
 * @param {import('./index.d.mts').AddonJob} job
 * @returns {string[]} cmake configure arguments
 */
const sdl3ConfigureArgs = (sourceDir, { paths, pins }) => {
  const args = ['-S', sourceDir, '-B', paths.sdlBuildDir, '-DCMAKE_BUILD_TYPE=Release', '-DSDL_SHARED=ON', '-DSDL_STATIC=OFF', '-DSDL_HIDAPI_LIBUSB=ON', `-DCMAKE_INSTALL_PREFIX=${paths.installDir}`];
  if (process.platform === 'linux') args.push('-DSDL_UNIX_CONSOLE_BUILD=ON');
  if (process.platform === 'win32') args.push(...windowsArgs(paths, pins.libusbVersion));
  return args;
};

export { sdl3ConfigureArgs };
