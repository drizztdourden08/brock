/* @layer renderer-shell @kind component */
import { Card, Grid } from '@drizztdourden08/tessera/primitives';
import type { DashboardCardProps } from './DashboardCard.type';

const DashboardCard = ({ span, title, subtitle, actions, children }: DashboardCardProps) => (
  <Grid.Cell span={span}>
    <Card title={title} subtitle={subtitle} actions={actions}>{children}</Card>
  </Grid.Cell>
);

export { DashboardCard };
