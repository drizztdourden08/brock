/* @layer renderer-shell @kind component */
import { useRandomizerGame } from '../../game-registry/behavior/useRandomizerGame';
import { groupsOf } from '../behavior/groups-of';
import { OptionGroupList } from '../OptionGroupList';
import { UPCOMING_TAB_ID, UPCOMING_TITLE } from '../OptionsPanel/OptionsPanel.constants';
import { UpcomingTabBody } from '../UpcomingTabBody';
import type { OptionTabBodyProps } from './OptionTabBody.type';

const OptionTabBody = ({ tab, values, overrides, onChange, frozen, cellOf }: OptionTabBodyProps) => {
  const game = useRandomizerGame();
  const options = (game?.catalog ?? []).filter((option) => tab.keys?.includes(option.key));
  const valueOf = (option: { key: string }) => values[option.key];

  if (tab.id === UPCOMING_TAB_ID) return <UpcomingTabBody title={UPCOMING_TITLE} options={options} valueOf={valueOf} />;
  return (
    <OptionGroupList
      groups={groupsOf(options)}
      valueOf={valueOf}
      cellOf={cellOf}
      frozen={frozen}
      live
      onRowChange={onChange === undefined ? undefined : (key, next) => onChange({ ...overrides, [key]: next })}
    />
  );
};

export { OptionTabBody };
