/* @layer renderer-shell @kind logic */
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardStepDef, ProfileWizardValues } from './profile-wizard-step.type';

const DEFAULT_ANCHOR = 'review';

const placeWizardSteps = <V extends ProfileWizardValues>(app: readonly WizardStepDef<V>[], modules: readonly ProfileWizardStepDef[]): WizardStepDef<V>[] => {
  const placed = modules.map((module) => ({ before: module.before ?? DEFAULT_ANCHOR, def: { ...module.step, id: module.id } as WizardStepDef<V> }));
  const appIds = new Set(app.map((step) => step.id));
  const inserted = app.flatMap((step) => [...placed.filter((entry) => entry.before === step.id).map((entry) => entry.def), step]);
  return [...inserted, ...placed.filter((entry) => !appIds.has(entry.before)).map((entry) => entry.def)];
};

export { placeWizardSteps };
