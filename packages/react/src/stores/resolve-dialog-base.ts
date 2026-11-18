/* @layer renderer-shell @kind logic */
import { controlSources } from '../app/control-sources';
import type { ConfirmBase, ConfirmBaseOptions } from './dialog.type';

const resolveDialogBase = (options: ConfirmBaseOptions): ConfirmBase => {
  const { text } = controlSources.get();
  const { title, message, confirmLabel, cancelLabel, facts, ...rest } = options;
  return {
    ...rest,
    title: text(title),
    message: text(message),
    ...(confirmLabel === undefined ? {} : { confirmLabel: text(confirmLabel) }),
    ...(cancelLabel === undefined ? {} : { cancelLabel: text(cancelLabel) }),
    ...(facts === undefined ? {} : { facts: facts.map((fact) => ({ label: text(fact.label), value: text(fact.value) })) }),
  };
};

export { resolveDialogBase };
