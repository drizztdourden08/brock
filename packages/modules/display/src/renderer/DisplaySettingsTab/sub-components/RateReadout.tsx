/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { StatRow, Text } from '@drizztdourden08/tessera/primitives';
import { isSyncedRate } from '../../../rates/is-synced-rate';
import { DISPLAY_ROW_COPY } from '../DisplaySettingsTab.constants';
import type { RateReadoutProps } from '../DisplaySettingsTab.type';

const RateReadout = (props: RateReadoutProps) => {
  const { currentHz } = props;
  const text = useText();
  const rounded = currentHz === null ? null : Math.round(currentHz);
  const uneven = rounded !== null && !isSyncedRate(currentHz);
  const value = rounded === null ? text(msg('display:readout.unknown')) : text(msg('display:rate.hz', { hz: rounded }));

  return (
    <>
      <StatRow label={text(DISPLAY_ROW_COPY.detectedRate.label)} value={value} mono />
      {uneven ? (
        <Text variant="caption" className="display-tab__warning">
          {text(msg('display:readout.warning', { hz: rounded }))}
        </Text>
      ) : null}
    </>
  );
};

export { RateReadout };
