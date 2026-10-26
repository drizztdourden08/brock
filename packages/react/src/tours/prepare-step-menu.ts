/* @layer renderer-shell @kind logic */
import { openStepMenu } from './open-step-menu';
import { revealMenuEntry } from './reveal-menu-entry';
import type { TourStepDef } from './tour.type';

const prepareStepMenu = async (step: TourStepDef, signal: AbortSignal): Promise<void> => {
  if (!step.openMenu) return;
  openStepMenu(step.openMenu, signal);
  if (step.target && 'menuEntry' in step.target) await revealMenuEntry(step.target.menuEntry, signal);
};

export { prepareStepMenu };
