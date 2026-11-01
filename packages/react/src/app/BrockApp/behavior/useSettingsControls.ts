/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { SettingsControlsValue } from '../../brock-context.type';
import type { BrockAppSettings } from '../BrockApp.type';

const useSettingsControls = <S extends object>(settings: BrockAppSettings<S>): SettingsControlsValue =>
  useMemo<SettingsControlsValue>(
    () => ({
      defaults: settings.defaults,
      renderControl: settings.renderControl as SettingsControlsValue['renderControl'],
      isDisabled: settings.isDisabled as SettingsControlsValue['isDisabled'],
      lockCauseOf: settings.lockCauseOf as SettingsControlsValue['lockCauseOf'],
      lockOverlay: settings.lockOverlay,
    }),
    [settings.defaults, settings.renderControl, settings.isDisabled, settings.lockCauseOf, settings.lockOverlay],
  );

export { useSettingsControls };
