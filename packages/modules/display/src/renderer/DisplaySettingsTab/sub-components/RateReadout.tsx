/* @layer renderer-shell @kind component */
import { StatRow, Text } from '@drizztdourden08/tessera/primitives';
import { isSyncedRate } from '../../../rates/is-synced-rate';
import type { RateReadoutProps } from '../DisplaySettingsTab.type';

const RateReadout = (props: RateReadoutProps) => {
  const { currentHz } = props;
  const rounded = currentHz === null ? null : Math.round(currentHz);
  const uneven = rounded !== null && !isSyncedRate(currentHz);

  return (
    <>
      <StatRow label="Detected now" value={rounded === null ? 'unknown' : `${rounded} Hz`} mono />
      {uneven ? (
        <Text variant="caption" className="display-tab__warning">
          {`${rounded} Hz is not a multiple of 60. Content made at 60 frames a second cannot give every frame the same time on screen, which shows as stutter when the picture scrolls.`}
        </Text>
      ) : null}
    </>
  );
};

export { RateReadout };
