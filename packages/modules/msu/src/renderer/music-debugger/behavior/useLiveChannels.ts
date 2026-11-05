/* @layer renderer-shell @kind hook */
import { useEffect, useMemo, useState } from 'react';
import { isMsuSessionActive, msuChannelReport } from '../../../msu-session';
import type { MsuDebugChannels } from '../../game/msu-debug-channels.type';
import { createPreviewReportStore } from '../../preview-report';
import { DEFAULT_SLOTS } from './live-channels.constants';
import type { LiveChannel } from '../MusicDebuggerWidget.type';

const programDetail = (id: number, overlappingSets: number): string =>
  overlappingSets > 1 ? `id 0x${id.toString(16)}, ${overlappingSets} overlapping` : `id 0x${id.toString(16)}`;

const liveChannelsOf = (debug: MsuDebugChannels): LiveChannel[] => debug.channels.map((name) => ({
  name,
  title: debug.titles[name] ?? name,
  slots: debug.layerSlots[name] ?? DEFAULT_SLOTS,
  store: createPreviewReportStore(),
}));

const publishChannel = (channel: LiveChannel): void => {
  const report = msuChannelReport(channel.name);
  channel.store.publish(report === null ? null : {
    key: channel.name,
    elapsedSeconds: report.elapsedSeconds,
    layers: report.layers,
    detail: programDetail(report.id, report.setCount),
  });
};

const useLiveChannels = (debug: MsuDebugChannels) => {
  const channels = useMemo(() => liveChannelsOf(debug), [debug]);
  const [sessionActive, setSessionActive] = useState(isMsuSessionActive);

  useEffect(() => {
    let frame = 0;
    const poll = (): void => {
      setSessionActive(isMsuSessionActive());
      channels.forEach(publishChannel);
      frame = requestAnimationFrame(poll);
    };
    frame = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(frame);
  }, [channels]);

  return { channels, sessionActive };
};

export { useLiveChannels };
