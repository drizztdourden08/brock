/* @layer renderer-shell @kind component */
import { Button, Text } from '@drizztdourden08/tessera/primitives';
import type { RunPanelProps } from '../../../../../contract/randomizer-views.type';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { StatTiles } from '../../../dashboard/StatTiles';
import { settingTilesOf } from '../../behavior/settings-tiles';
import { RUN_SPANS } from '../../RunView.constants';
import { NO_SETTINGS_MESSAGE, OPEN_OPTIONS_LABEL, SETTINGS_TITLE } from './RunSettings.constants';

const RunSettings = ({ config, open }: RunPanelProps) => {
  const tiles = settingTilesOf(config);
  const openOptions = <Button variant="secondary" size="sm" onClick={() => open('options')}>{OPEN_OPTIONS_LABEL}</Button>;

  return (
    <DashboardCard span={RUN_SPANS.settings} title={SETTINGS_TITLE} actions={openOptions}>
      {tiles.length === 0 ? <Text variant="caption">{NO_SETTINGS_MESSAGE}</Text> : <StatTiles tiles={tiles} />}
    </DashboardCard>
  );
};

export { RunSettings };
