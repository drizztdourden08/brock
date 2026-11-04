/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { composeLockCauses } from '../../../settings/lock-causes/compose-lock-causes';
import { LOCK_CAUSE_ORDER } from '../../../settings/lock-causes/lock-cause-order.constants';
import type { LockCauseProvider } from '../../../settings/lock-causes/lock-cause-provider.type';
import type { SettingsControlsValue } from '../../brock-context.type';
import type { BrockAppSettings } from '../BrockApp.type';

const useSettingsControls = <S extends object>(settings: BrockAppSettings<S>, moduleCauses: readonly LockCauseProvider[]): SettingsControlsValue =>
  useMemo<SettingsControlsValue>(() => {
    const legacy: LockCauseProvider<S>[] = settings.lockCauseOf ? [{ id: 'app', order: LOCK_CAUSE_ORDER.app, causeOf: settings.lockCauseOf }] : [];
    return {
      defaults: settings.defaults,
      renderControl: settings.renderControl as SettingsControlsValue['renderControl'],
      isDisabled: settings.isDisabled as SettingsControlsValue['isDisabled'],
      lockCauseOf: composeLockCauses<S>([...legacy, ...(settings.lockCauses ?? []), ...moduleCauses]) as SettingsControlsValue['lockCauseOf'],
      lockOverlay: settings.lockOverlay,
    };
  }, [settings.defaults, settings.renderControl, settings.isDisabled, settings.lockCauseOf, settings.lockCauses, settings.lockOverlay, moduleCauses]);

export { useSettingsControls };
