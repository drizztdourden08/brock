/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { BindingRow } from './BindingRow';
import type { VerbRowProps } from './VerbRow.type';

const VerbRow = ({ verb, groupTitle, binding, icon, labels, onRebind }: VerbRowProps) => {
  const handleRebind = useCallback(() => onRebind(verb.id), [onRebind, verb.id]);
  return (
    <BindingRow
      actionLabel={verb.label}
      middleLabel={groupTitle}
      binding={binding}
      bindingIcon={icon}
      labels={labels}
      onRebind={handleRebind}
    />
  );
};

export { VerbRow };
