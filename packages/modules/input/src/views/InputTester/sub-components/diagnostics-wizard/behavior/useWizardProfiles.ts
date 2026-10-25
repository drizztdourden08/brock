/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { DeviceProfile } from '../../../../../device-profile';
import type { ResolvedDevice } from '../../../../../family';
import { resolveDeviceFromEntry } from '../../../../../runtime/resolve-device';
import type { UseWizardProfilesParams } from '../diagnostics-wizard.type';
import { buildProfileFromResolved } from './build-chooser-profile';

const useWizardProfiles = (params: UseWizardProfilesParams) => {
  const { selectedChooser, liveDeviceEntry, capturedLayout } = params;

  const resolvedDevice: ResolvedDevice | null = useMemo(
    () => (liveDeviceEntry ? resolveDeviceFromEntry(liveDeviceEntry) : null),
    [liveDeviceEntry],
  );

  const profile: DeviceProfile | null = useMemo(() => {
    if (!selectedChooser || !resolvedDevice) return null;
    return buildProfileFromResolved(resolvedDevice, selectedChooser.vendorId, selectedChooser.productId);
  }, [selectedChooser, resolvedDevice]);

  const capturedProfile: DeviceProfile | null = useMemo(() => {
    if (!capturedLayout) return null;
    return buildProfileFromResolved(capturedLayout.resolved, capturedLayout.entry.vendorId, capturedLayout.entry.productId);
  }, [capturedLayout]);

  return { resolvedDevice, profile, capturedProfile };
};

export { useWizardProfiles };
