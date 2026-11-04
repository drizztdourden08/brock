/* @layer renderer-shell @kind component */
import { ProgressBar } from '@drizztdourden08/tessera/primitives';
import { Spoiler } from './Spoiler';
import type { ProgressBlockProps } from './ProgressBlock.type';

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
