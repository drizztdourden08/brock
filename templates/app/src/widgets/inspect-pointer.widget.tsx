/* @layer renderer-app @kind component */
import { useT } from '@drizztdourden08/brock-react';
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import { useInspectStore } from '../stores/useInspectStore';

const meta: WidgetMeta = { label: 'Pointer', icon: 'mouse', kit: 'inspect', chrome: 'compact', defaultSide: 'right', defaultDockedSize: 240 };

const InspectPointerWidget = () => {
  const t = useT();
  const pointer = useInspectStore((s) => s.pointer);
  const view = useInspectStore((s) => s.view);
  return (
    <Stack>
      <StatRow label={t('app:inspect.pointer.label')} value={pointer ? `${pointer.x}, ${pointer.y}` : t('app:inspect.pointer.outside')} mono />
      <StatRow label={t('app:inspect.pointer.view')} value={view ? `${view.width} × ${view.height}` : '-'} mono />
    </Stack>
  );
};

export default InspectPointerWidget;
export { meta };
