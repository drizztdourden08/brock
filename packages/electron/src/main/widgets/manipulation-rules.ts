/* @layer electron-main @kind logic */
import type { ManipulationRules } from './widget-windows.type';

const manipulationRules = (ctrl: boolean, snapOn: boolean): ManipulationRules => ({ snap: snapOn && !ctrl, shared: !ctrl });

export { manipulationRules };
