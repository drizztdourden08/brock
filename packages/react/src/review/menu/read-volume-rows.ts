/* @layer renderer-shell @kind logic */
import { readMenu } from './read-menu';

const readVolumeRows = (label: string, muteLabel: string): { muteRow: boolean; sliderRow: boolean } => {
  const { items } = readMenu();
  const at = items.findIndex((item) => item.isSlider === true && item.label === label);
  const before = at > 0 ? items[at - 1] : undefined;
  return { sliderRow: at >= 0, muteRow: before?.label === muteLabel };
};

export { readVolumeRows };
