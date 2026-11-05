/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { clock } from '../../audition/clock';
import { usePreviewReport } from '../../preview-report';
import { layerSlots } from '../behavior/layer-slot';
import { NONE } from '../MusicDebuggerWidget.constants';
import type { LiveChannel } from '../MusicDebuggerWidget.type';
import { LayerSlot } from './LayerSlot';
import './ChannelLive.css';

const ChannelLive = (props: { channel: LiveChannel }) => {
  const { channel } = props;
  const report = usePreviewReport(channel.store, channel.name);
  const slots = layerSlots(report?.layers ?? [], channel.slots);

  return (
    <Box className="channel-live" data-silent={report === null ? 'yes' : 'no'}>
      <Box className="channel-live__head">
        <Text className="channel-live__title">{channel.title}</Text>
        <Text className="channel-live__detail">{report === null ? 'silent' : (report.detail ?? NONE)}</Text>
        <Text className="channel-live__clock">{report === null ? NONE : clock(report.elapsedSeconds)}</Text>
      </Box>
      {slots.map((slot, index) => <LayerSlot key={index} slot={slot} />)}
    </Box>
  );
};

export { ChannelLive };
