/* @layer renderer-shell @kind component */
import { ProgressBar } from '@drizztdourden08/tessera/primitives';
import type { ProgressBlock as ProgressBlockData } from '../../../provider/block.type';
import type { GameInfoPrefsValue } from '../GameInfoWidget.type';
import { Spoiler } from './Spoiler';

interface ProgressBlockProps {
  block: ProgressBlockData;
  prefs: GameInfoPrefsValue;
}

const ProgressBlock = ({ block, prefs }: ProgressBlockProps) => (
  <>
    {block.items.map((item, index) => (
      <Spoiler key={index} hidden={Boolean(item.spoiler) && prefs.hideSpoilers}>
        <ProgressBar label={item.label} value={item.done} max={item.total} showValue />
      </Spoiler>
    ))}
  </>
);

export { ProgressBlock };
