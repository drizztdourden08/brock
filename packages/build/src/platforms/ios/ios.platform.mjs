/* @layer tooling-scripts @kind config */
import { definePlatform } from '../define-platform.mjs';

const iosPlatform = definePlatform({ id: 'ios', label: 'iOS', supported: false });

export { iosPlatform };
