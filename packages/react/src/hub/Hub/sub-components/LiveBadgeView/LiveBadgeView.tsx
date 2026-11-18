/* @layer renderer-shell @kind component */
import { Badge } from '@drizztdourden08/tessera/primitives';
import { useText } from '../../../../i18n';
import { LIVE_BADGES } from '../../../hub.constants';
import type { LiveBadgeViewProps } from './LiveBadgeView.type';

const LiveBadgeView = (props: LiveBadgeViewProps) => {
  const { color, label } = LIVE_BADGES[props.badge];
  const text = useText();
  return <Badge variant="dot" color={color} label={text(label)} />;
};

export { LiveBadgeView };
