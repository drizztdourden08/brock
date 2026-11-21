/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import { fallbackText } from '../../i18n/fallback-text';
import type { ProfileWizardStepDef, ProfileWizardValues } from './profile-wizard-step.type';
import { DEFAULT_ANCHOR } from './place-wizard-steps.constants';
import { resolveWizardStep } from './resolve-wizard-step';

const placeWizardSteps = <V extends ProfileWizardValues>(app: readonly WizardStepDef<V>[], modules: readonly ProfileWizardStepDef[], text: (value: Text) => string = fallbackText): WizardStepDef<V>[] => {
  const placed = modules.map((module) => ({ before: module.before ?? DEFAULT_ANCHOR, def: resolveWizardStep(module, text) as WizardStepDef<V> }));
  const appIds = new Set(app.map((step) => step.id));
  const inserted = app.flatMap((step) => [...placed.filter((entry) => entry.before === step.id).map((entry) => entry.def), step]);
  return [...inserted, ...placed.filter((entry) => !appIds.has(entry.before)).map((entry) => entry.def)];
};

export { placeWizardSteps };
