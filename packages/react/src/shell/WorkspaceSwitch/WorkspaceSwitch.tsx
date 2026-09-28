/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { FloatingSwitch } from '@drizztdourden08/tessera/composites';
import type { WorkspaceSwitchProps } from './WorkspaceSwitch.type';

const WorkspaceSwitch = (props: WorkspaceSwitchProps) => {
  const { items, current, onSelect, label = 'Switch workspace' } = props;
  const switchItems = useMemo(() => items.map((item) => ({ ...item })), [items]);
  return <FloatingSwitch items={switchItems} activeId={current} onSelect={onSelect} label={label} />;
};

export { WorkspaceSwitch };
