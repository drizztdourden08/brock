/* @layer renderer-shell @kind logic */
import type { ReviewOutcome, VolumeItemSnapshot } from '../review.type';
import { outcome } from './outcome';

const volumeChecks = (id: string, snapshot: VolumeItemSnapshot): ReviewOutcome[] => {
  const { shown, toggled, restored, width, tucked, inMenu } = snapshot;
  return [
    outcome(`volume-${id}-shown`, shown, `the volume item "${id}" shows in the title bar with its icon`, `the volume item "${id}" is not in the title bar`),
    outcome(
      `volume-${id}-mutes`,
      toggled && restored,
      `a click on "${id}" mutes and a second click unmutes`,
      `a click on "${id}" did not ${toggled ? 'unmute again' : 'toggle mute'}`,
    ),
    outcome(
      `volume-${id}-tucks`,
      tucked && inMenu,
      `in a ${width} px wide window "${id}" leaves the bar and the main menu holds its Mute row`,
      `in a ${width} px wide window ${tucked ? `the main menu has no Mute row for "${id}"` : `"${id}" stays on the bar`}`,
    ),
  ];
};

export { volumeChecks };
