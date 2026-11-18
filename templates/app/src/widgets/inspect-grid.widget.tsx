/* @layer renderer-app @kind component */
import { useT } from '@drizztdourden08/brock-react';
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { Icon, IconButton, Slider, Stack, Toggle } from '@drizztdourden08/tessera/primitives';
import { useInspectStore } from '../stores/useInspectStore';

const resetGrid = (): void => useInspectStore.getState().reset();

const meta: WidgetMeta = {
  label: 'Grid',
  icon: 'layout-grid',
  kit: 'inspect',
  chrome: 'compact',
  defaultSide: 'left',
  defaultDockedSize: 240,
  tools: () => (
    <IconButton size="xs" label="Reset the grid" title="Reset the grid" onClick={resetGrid}>
      <Icon name="rotate-ccw" size={14} />
    </IconButton>
  ),
};

const InspectGridWidget = () => {
  const t = useT();
  const grid = useInspectStore((s) => s.grid);
  const centre = useInspectStore((s) => s.centre);
  const setGrid = useInspectStore((s) => s.setGrid);
  const setCentre = useInspectStore((s) => s.setCentre);
  return (
    <Stack>
      <Slider label={t('app:inspect.grid.size')} min={8} max={128} step={8} value={grid} showValue formatValue={(value) => t('app:inspect.grid.size.value', { value })} onChange={setGrid} />
      <Toggle label={t('app:inspect.grid.centre')} checked={centre} onChange={setCentre} />
    </Stack>
  );
};

export default InspectGridWidget;
export { meta };
