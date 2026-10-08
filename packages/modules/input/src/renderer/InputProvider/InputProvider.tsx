/* @layer renderer-shell @kind component */
import { useInputHost } from './behavior/useInputHost';
import type { InputProviderProps } from './InputProvider.type';

const InputProvider = (props: InputProviderProps) => {
  const { children } = props;
  useInputHost();
  return <>{children}</>;
};

export { InputProvider };
