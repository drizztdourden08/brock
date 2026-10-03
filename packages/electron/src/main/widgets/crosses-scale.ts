/* @layer electron-main @kind logic */
import { screen } from 'electron';
import type { WidgetWindowBounds } from '@drizztdourden08/brock-core';

const crossesScale = (from: WidgetWindowBounds, to: WidgetWindowBounds): boolean =>
  screen.getDisplayMatching(from).scaleFactor !== screen.getDisplayMatching(to).scaleFactor;

export { crossesScale };
