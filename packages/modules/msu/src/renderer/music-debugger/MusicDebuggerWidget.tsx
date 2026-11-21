/* @layer renderer-shell @kind component */
import { useT } from '@drizztdourden08/brock-react';
import { Box, Button, SectionHeader, Status } from '@drizztdourden08/tessera/primitives';
import { useMsuStudioGame } from '../game/useMsuStudioGame';
import { useLiveChannels } from './behavior/useLiveChannels';
import { useMusicDebugData } from './behavior/useMusicDebugData';
import { ChannelLive } from './sub-components/ChannelLive';
import { CounterTable } from './sub-components/CounterTable';
import { EventFeed } from './sub-components/EventFeed';
import './MusicDebuggerWidget.css';

const MusicDebuggerWidget = () => {
  const t = useT();
  const { debug } = useMsuStudioGame();
  const { channels, sessionActive } = useLiveChannels(debug);
  const { events, counters, clear } = useMusicDebugData();

  return (
    <Box className="music-widget" data-session={sessionActive ? 'active' : 'none'}>
      <Box className="music-widget__section">
        <SectionHeader
          title={t('msu:debugger.replacement')}
          action={<Status tone={sessionActive ? 'success' : 'neutral'}>{sessionActive ? t('msu:debugger.session.active') : t('msu:debugger.session.none')}</Status>}
        />
        {channels.map((channel) => <ChannelLive key={channel.name} channel={channel} />)}
      </Box>

      <Box className="music-widget__section">
        <SectionHeader
          title={t('msu:debugger.counts')}
          action={<Button variant="ghost" size="sm" onClick={clear}>{t('msu:debugger.clear')}</Button>}
        />
        <CounterTable counters={counters} />
      </Box>

      <Box className="music-widget__section music-widget__section--feed">
        <SectionHeader title={t('msu:debugger.events')} />
        <EventFeed events={events} />
      </Box>
    </Box>
  );
};

export { MusicDebuggerWidget };
