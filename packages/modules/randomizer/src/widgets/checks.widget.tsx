/* @layer renderer-app @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { WidgetMeta } from '@drizztdourden08/brock-react';
import { useRandomizerGame } from '../renderer/game-registry/behavior/useRandomizerGame';
import { useRandomizerGameStore } from '../renderer/game-registry/behavior/useRandomizerGameStore';
import { ChecksView } from '../renderer/views/ChecksView';
import { CHECKS_DOCKED_SIZE, CHECKS_FLOATING_SIZE, CHECKS_WIDGET_ICON, CHECKS_WIDGET_ID } from './checks.widget.constants';
import { ChecksWidgetSettings } from '../renderer/tracker/ChecksWidgetSettings';

const ChecksWidget = () => {
  const Checks = useRandomizerGame()?.views?.Checks;
  return Checks ? <Checks /> : <ChecksView prefKey={CHECKS_WIDGET_ID} />;
};

const meta: WidgetMeta = {
  label: msg('randomizer:widget.checks'),
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
