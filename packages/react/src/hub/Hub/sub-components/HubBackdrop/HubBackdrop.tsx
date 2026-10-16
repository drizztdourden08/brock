/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { backdropStyle } from './behavior/backdrop-style';
import type { HubBackdropProps } from './HubBackdrop.type';
import './HubBackdrop.css';

const HubBackdrop = (props: HubBackdropProps) => {
  const { backdrop } = props;
  const image = backdrop.kind === 'image' ? backdrop : null;
  return (
    <Box
      className={['hub-backdrop', image?.pixelated === true ? 'hub-backdrop--pixelated' : ''].filter(Boolean).join(' ')}
      data-fit={image === null ? undefined : image.fit ?? 'cover'}
      style={backdropStyle(backdrop)}
      aria-hidden="true"
    />
  );
};

export { HubBackdrop };
