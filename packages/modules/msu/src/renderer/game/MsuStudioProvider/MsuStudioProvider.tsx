/* @layer renderer-shell @kind component */
import { MsuStudioContext } from '../msu-studio-context';
import type { MsuStudioProviderProps } from './MsuStudioProvider.type';

const MsuStudioProvider = ({ game, children }: MsuStudioProviderProps) => (
  <MsuStudioContext.Provider value={game as never}>{children}</MsuStudioContext.Provider>
);

export { MsuStudioProvider };
