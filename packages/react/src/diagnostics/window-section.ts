/* @layer renderer-shell @kind logic */
import { debugSection } from './debug-section';
import type { DebugSection, WindowEnvironment } from './diagnostics.type';
import { formatUnits } from './format-units';

const windowSection = (env: WindowEnvironment): DebugSection => debugSection('Window', [
  `Screen: ${env.screenWidth}x${env.screenHeight} at ${env.devicePixelRatio}x, available ${env.availWidth}x${env.availHeight}`,
  `Viewport: ${env.viewportWidth}x${env.viewportHeight}, colour ${env.colorDepth}-bit`,
  `Preferences: ${env.colorScheme} scheme, reduced motion ${formatUnits.yesNo(env.reducedMotion)}`,
]);

export { windowSection };
