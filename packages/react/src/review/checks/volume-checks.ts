/* @layer renderer-shell @kind logic */
import type { ReviewOutcome, VolumeItemSnapshot } from '../review.type';
import { outcome } from './outcome';

const openedBy = (hover: boolean, focus: boolean): string => [hover && 'hover', focus && 'focus'].filter(Boolean).join(' and ');

const tuckFailure = (id: string, snapshot: VolumeItemSnapshot): string => {
  if (!snapshot.tucked) return `"${id}" stays on the bar`;
  if (!snapshot.muteRow) return `the main menu has no Mute row for "${id}"`;
  return `the main menu has no slider row for "${id}"`;
};

const volumeChecks = (id: string, snapshot: VolumeItemSnapshot): ReviewOutcome[] => {
  const { shown, hoverOpens, focusOpens, slides, toggled, restored, width, tucked, muteRow, sliderRow } = snapshot;
  return [
    outcome(`volume-${id}-shown`, shown, `the volume item "${id}" shows in the title bar with its icon`, `the volume item "${id}" is not in the title bar`),
    outcome(
      `volume-${id}-slider-opens`,
      hoverOpens || focusOpens,
      `the slider of "${id}" opens on ${openedBy(hoverOpens, focusOpens)}`,
      `neither hover nor focus opens the slider of "${id}"`,
    ),
    outcome(`volume-${id}-slides`, slides, `moving the slider of "${id}" changes the volume`, `moving the slider of "${id}" did not change the volume`),
    outcome(
      `volume-${id}-mutes`,
      toggled && restored,
      `a click on "${id}" mutes and a second click unmutes`,
      `a click on "${id}" did not ${toggled ? 'unmute again' : 'toggle mute'}`,
    ),
    outcome(
      `volume-${id}-tucks`,
      tucked && muteRow && sliderRow,
      `in a ${width} px wide window "${id}" leaves the bar and the main menu holds its Mute row and its slider row`,
      `in a ${width} px wide window ${tuckFailure(id, snapshot)}`,
    ),
  ];
};

export { volumeChecks };
