/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { WizardStepDef } from '@drizztdourden08/tessera/composites';
import type { ProfileWizardStepDef, ProfileWizardValues } from './profile-wizard-step.type';

const resolveWizardStep = (def: ProfileWizardStepDef, text: (value: Text) => string): WizardStepDef<ProfileWizardValues> => {
  const { label, description, summary, subSteps, ...rest } = def.step;
  const resolved: WizardStepDef<ProfileWizardValues> = { ...rest, id: def.id, label: text(label) };
  if (description !== undefined) resolved.description = text(description);
  if (summary) resolved.summary = (values) => {
    const shown = summary(values);
    return shown === undefined ? undefined : text(shown);
  };
  if (subSteps) resolved.subSteps = (values) => subSteps(values).map((sub) => ({ ...sub, label: text(sub.label) }));
  return resolved;
};

export { resolveWizardStep };
