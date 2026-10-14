/* @layer renderer-shell @kind component */
import { useEffect } from 'react';
import { UpdateDialog } from '../UpdateDialog';
import { useUpdaterStore } from '../useUpdaterStore';
import { useSelfUpdateHost } from '../useSelfUpdateHost';
import type { UpdaterProviderProps } from './UpdaterProvider.type';

const UpdaterProvider = (props: UpdaterProviderProps) => {
  const { children } = props;
  const connect = useUpdaterStore((s) => s.connect);
  const host = useSelfUpdateHost();

  useEffect(() => (host ? connect() : undefined), [host, connect]);

  return (
    <>
      {children}
      {host && <UpdateDialog />}
    </>
  );
};

export { UpdaterProvider };
