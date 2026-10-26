/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { AppBackgroundProps } from './AppBackground.type';

const AppBackground = ({ children }: AppBackgroundProps) =>
  (children ? <Box className="brock-app__background" aria-hidden="true">{children}</Box> : null);

export { AppBackground };
