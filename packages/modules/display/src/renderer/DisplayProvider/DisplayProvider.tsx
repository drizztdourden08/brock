/* @layer renderer-shell @kind component */
import { useDisplayHost } from './behavior/useDisplayHost';
import { useDisplaySync } from './behavior/useDisplaySync';
import { useDisplayWatch } from './behavior/useDisplayWatch';
import type { DisplayProviderProps } from './DisplayProvider.type';

const DisplayProvider = (props: DisplayProviderProps) => {
  const { children } = props;
  useDisplayHost();
  useDisplayWatch();
  useDisplaySync();
  return <>{children}</>;
};

export { DisplayProvider };
