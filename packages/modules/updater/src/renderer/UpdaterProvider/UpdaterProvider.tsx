/* @layer renderer-shell @kind component */
import { useEffect } from 'react';
import { UpdateDialog } from '../UpdateDialog';
import { useUpdaterStore } from '../useUpdaterStore';
import type { UpdaterProviderProps } from './UpdaterProvider.type';

const UpdaterProvider = (props: UpdaterProviderProps) => {
  const { children } = props;
  const connect = useUpdaterStore((s) => s.connect);

  useEffect(() => connect(), [connect]);

  return (
    <>
      {children}
      <UpdateDialog />
    </>
  );
};

export { UpdaterProvider };
