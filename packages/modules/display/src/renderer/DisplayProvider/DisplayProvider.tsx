/* @layer renderer-shell @kind component */
import { useDisplaySync } from './behavior/useDisplaySync';
import { useDisplayWatch } from './behavior/useDisplayWatch';
import type { DisplayProviderProps } from './DisplayProvider.type';

const DisplayProvider = (props: DisplayProviderProps) => {
  const { children } = props;
  useDisplayWatch();
  useDisplaySync();
  return <>{children}</>;
};

export { DisplayProvider };
