/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Grid } from '@drizztdourden08/tessera/primitives';
import { DashboardCard } from '../../../dashboard/DashboardCard';
import { isPanelDef } from '../../behavior/is-panel-def';
import { RUN_SPANS } from '../../RunView.constants';
import type { GamePanelProps } from './GamePanel.type';

const GamePanel = ({ panel, ...props }: GamePanelProps) => {
  const text = useText();
  if (!isPanelDef(panel)) {
    const Plain = panel;
    return <Grid.Cell span={RUN_SPANS.game}><Plain /></Grid.Cell>;
  }
  const { Body, actions: Actions, span, title } = panel;
  return <DashboardCard span={span} title={text(title)} actions={Actions && <Actions {...props} />}><Body {...props} /></DashboardCard>;
};

export { GamePanel };
