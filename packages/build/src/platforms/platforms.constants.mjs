/* @layer tooling-scripts @kind constants */
const PLATFORM_ORDER = ['windows', 'macos', 'linux', 'android', 'ios', 'web'];

const BUNDLES = Object.freeze({
  desktop: ['windows', 'macos', 'linux'],
  mobile: ['android'],
});

const BUNDLE_LABELS = Object.freeze({
  desktop: 'Windows, macOS and Linux',
  mobile: 'Android today, iOS once it is supported',
});

const DEFAULT_TARGETS = ['desktop'];

export { PLATFORM_ORDER, BUNDLES, BUNDLE_LABELS, DEFAULT_TARGETS };
