/* @layer renderer-shell @kind component */
import { Grid } from '@drizztdourden08/tessera/primitives';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { isPanelDef } from '../../behavior/is-panel-def';
import { RUN_SPANS } from '../../RunView.constants';
import type { GamePanelProps } from './GamePanel.type';

const GamePanel = ({ panel, config, open }: GamePanelProps) => {
  if (!isPanelDef(panel)) {
    const Plain = panel;
    return <Grid.Cell span={RUN_SPANS.game}><Plain /></Grid.Cell>;
  }
  const { Body, span, title } = panel;
  return <DashboardCard span={span} title={title}><Body config={config} open={open} /></DashboardCard>;
};

export { GamePanel };
