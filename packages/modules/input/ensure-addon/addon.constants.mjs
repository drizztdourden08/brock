/* @layer tooling-scripts @kind constants */
const RELEASE_REPO = 'drizztdourden08/brock';
const RELEASE_TAG_PREFIX = 'sdl3-addon-v';
const ASSET_PREFIX = 'sdl3-input';
const ADDON_FILE = 'sdl3_input.node';
const LOG_TAG = '[brock-input addon]';
const SOURCE_EXTENSIONS = ['.cc', '.h'];
const RUNTIME_FILE = /\.(node|dll|dylib|so(\.\d+)*)$/i;
const BUILD_HINT = 'Build it from source in the brock checkout: pnpm --filter @drizztdourden08/brock-input addon:build';

const SDL3_CHECKSUMS = Object.freeze({
  'SDL3-3.4.14.tar.gz': '30d4aa2b3037718142b32dffd4e72f917ebb6cc5227150e7bb9c45efb2153aeb',
  'libusb-1.0.30.7z': '7fb1dfec805b97983763d7d0ae244320da12add1003d4249c96cc4d586398c79',
});

const WIN_ARCH = Object.freeze({
  x64: { cmakePlatform: 'x64', libusbDir: 'VS2022/MS64' },
  ia32: { cmakePlatform: 'Win32', libusbDir: 'VS2022/MS32' },
  arm64: { cmakePlatform: 'ARM64', libusbDir: 'VS2025/ARM64' },
});

const LIBUSB_HINT = Object.freeze({ linux: 'sudo apt install libusb-1.0-0-dev pkg-config', darwin: 'brew install libusb pkg-config' });

const LIBUSB_RUNTIME_NAME = Object.freeze({ linux: 'libusb-1.0.so.0', darwin: 'libusb-1.0.0.dylib' });

export {
  RELEASE_REPO, RELEASE_TAG_PREFIX, ASSET_PREFIX, ADDON_FILE, LOG_TAG, SOURCE_EXTENSIONS, RUNTIME_FILE, BUILD_HINT,
  SDL3_CHECKSUMS, WIN_ARCH, LIBUSB_HINT, LIBUSB_RUNTIME_NAME,
};
