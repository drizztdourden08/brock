/* @layer renderer-shell @kind component */
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { DEFAULT_RANDOMIZER_LABELS } from '../bucket/randomizer-bucket.constants';
import { useRandomizerGame } from '../game-registry/behavior/useRandomizerGame';
import { useRandomizerGameStore } from '../game-registry/behavior/useRandomizerGameStore';
import { ChecksView } from '../views/ChecksView';
import { CHECKS_DOCKED_SIZE, CHECKS_FLOATING_SIZE, CHECKS_WIDGET_ICON, CHECKS_WIDGET_ID } from './checks-widget.constants';
import { ChecksWidgetSettings } from './ChecksWidgetSettings';

const ChecksWidget = () => {
  const Checks = useRandomizerGame()?.views?.Checks;
  return Checks ? <Checks /> : <ChecksView prefKey={CHECKS_WIDGET_ID} />;
};

const meta: WidgetMeta = {
  label: DEFAULT_RANDOMIZER_LABELS.checks,
  icon: CHECKS_WIDGET_ICON,
  defaultVisibility: 'always',
  defaultSide: 'right',
  defaultDockedSize: CHECKS_DOCKED_SIZE,
  defaultFloatingSize: CHECKS_FLOATING_SIZE,
  popOut: false,
  settings: ChecksWidgetSettings,
  when: { when: () => useRandomizerGameStore.getState().game?.tracker !== undefined },
};

export default ChecksWidget;
export { meta };
