/* @layer renderer-components @kind types */
import type { ControlsGame } from '../ControlsSettings.type';
import type { ControlsCtrl } from './ControlsMain.type';

interface ControlsListenerProps {
  game: ControlsGame;
  ctrl: ControlsCtrl;
}

export type { ControlsListenerProps };
