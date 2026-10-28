/* @layer renderer-shell @kind logic */
import { useNavigationStore } from '../../navigation/useNavigationStore';
import { usePaletteStore } from '../../palette/usePaletteStore';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { useWidgetLayoutStore } from '../../widgets/useWidgetLayoutStore';
import type { WakeSource } from './wake.type';

const storeWake: WakeSource = (wake) => {
  const stops = [useNavigationStore, usePaletteStore, useProfilesStore, useWidgetLayoutStore].map((store) => store.subscribe(wake));
  return () => { for (const stop of stops) stop(); };
};

export { storeWake };
