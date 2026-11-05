/* @layer renderer-components @kind hook */
import { useEffect, useMemo } from 'react';
import { controlsForProfile } from '../../../bindings';
import { DEFAULT_LABELS } from '../ControlsSettings.constants';
import type { ControlsContext, ControlsLabels, ControlsSettingsProps } from '../ControlsSettings.type';
import { listeningLabel } from './listening-label';
import { useBindingState } from './useBindingState';
import { useControlsTabs } from './useControlsTabs';
import { useDeviceSync } from './useDeviceSync';
import { useDragDrop } from './useDragDrop';
import { useGlobalRows } from './useGlobalRows';
import { useProfileActions } from './useProfileActions';
import { useProfileRows } from './useProfileRows';
import { useVerbIcons } from './useVerbIcons';
import { useVerbScheme } from './useVerbScheme';

const useControlsSettings = ({ game, profiles, globalBindings, initialTab }: ControlsSettingsProps) => {
  const labels: ControlsLabels = useMemo(() => ({ ...DEFAULT_LABELS, ...game.labels }), [game.labels]);
  const profileActions = useProfileActions({ store: profiles, keyboardDefaults: game.keyboardDefaults });
  const { activeProfile, updateActiveProfile } = profileActions;
  const deviceSync = useDeviceSync();
  const { devices, entries } = deviceSync;

  const controls = useMemo(() => controlsForProfile(activeProfile, entries), [activeProfile, entries]);
  const verbScheme = useVerbScheme({ game, activeProfile, updateActiveProfile, controls });
  const { applyVerbBinding, applySlotBinding, verbBindings } = verbScheme;
  const bindingState = useBindingState({
    globalBindings, activeProfile, updateActiveProfile, applyVerbBinding, applySlotBinding,
  });
  const { listeningFor, globalMappings } = bindingState;

  const dragDrop = useDragDrop({ entries, game, activeProfile, updateActiveProfile });
  const profileRows = useProfileRows({ activeProfile, devices, labels });
  const globalRowsFor = useGlobalRows({ mappings: globalMappings, multiController: profileRows.multiController, devices });
  const verbIcons = useVerbIcons({ activeProfile, devices, verbBindings });
  const tabs = useControlsTabs({ tabs: game.tabs, initialTab });

  const listening = listeningFor !== null;
  useEffect(() => {
    game.onListeningChange?.(listening);
    return () => { if (listening) game.onListeningChange?.(false); };
  }, [game, listening]);

  const listeningName = listeningFor ? listeningLabel({ target: listeningFor, game }) : null;
  const context: ControlsContext = useMemo(
    () => ({ profile: activeProfile, devices, controls, updateProfile: updateActiveProfile }),
    [activeProfile, devices, controls, updateActiveProfile],
  );

  return {
    ...profileActions,
    ...deviceSync,
    ...verbScheme,
    ...bindingState,
    ...dragDrop,
    ...profileRows,
    ...tabs,
    labels,
    context,
    controls,
    verbIcons,
    globalRowsFor,
    listeningName,
  };
};

export { useControlsSettings };
