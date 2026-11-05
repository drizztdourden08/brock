/* @layer renderer-shell @kind component */
import { Box, Button, SectionHeader, Status } from '@drizztdourden08/tessera/primitives';
import { useMsuStudioGame } from '../game/useMsuStudioGame';
import { useLiveChannels } from './behavior/useLiveChannels';
import { useMusicDebugData } from './behavior/useMusicDebugData';
import { ChannelLive } from './sub-components/ChannelLive';
import { CounterTable } from './sub-components/CounterTable';
import { EventFeed } from './sub-components/EventFeed';
import './MusicDebuggerWidget.css';

const MusicDebuggerWidget = () => {
  const { debug } = useMsuStudioGame();
  const { channels, sessionActive } = useLiveChannels(debug);
  const { events, counters, clear } = useMusicDebugData();

  return (
    <Box className="music-widget" data-session={sessionActive ? 'active' : 'none'}>
      <Box className="music-widget__section">
        <SectionHeader
          title="Replacement audio"
          action={<Status tone={sessionActive ? 'success' : 'neutral'}>{sessionActive ? 'Pack session' : 'No pack session'}</Status>}
        />
        {channels.map((channel) => <ChannelLive key={channel.name} channel={channel} />)}
      </Box>

      <Box className="music-widget__section">
        <SectionHeader
          title="Counts"
          action={<Button variant="ghost" size="sm" onClick={clear}>Clear</Button>}
        />
        <CounterTable counters={counters} />
      </Box>

      <Box className="music-widget__section music-widget__section--feed">
        <SectionHeader title="Events" />
        <EventFeed events={events} />
      </Box>
    </Box>
  );
};

export { MusicDebuggerWidget };
