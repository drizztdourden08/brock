/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { FloatingSwitch } from '@drizztdourden08/tessera/composites';
import { useT } from '../../i18n';
import type { WorkspaceSwitchProps } from './WorkspaceSwitch.type';

const WorkspaceSwitch = (props: WorkspaceSwitchProps) => {
  const { items, current, onSelect, label } = props;
  const t = useT();
  const switchItems = useMemo(() => items.map((item) => ({ ...item })), [items]);
  return <FloatingSwitch items={switchItems} activeId={current} onSelect={onSelect} label={label ?? t('brock-shell:workspace.switch')} />;
};

export { WorkspaceSwitch };
