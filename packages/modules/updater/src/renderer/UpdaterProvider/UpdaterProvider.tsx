/* @layer renderer-shell @kind component */
import { useEffect } from 'react';
import { useEscapeLayer } from '@drizztdourden08/brock-react';
import { UpdateDialog } from '../UpdateDialog';
import { UPDATER_ESCAPE_LAYER } from '../updater-escape.constants';
import { useUpdaterStore } from '../useUpdaterStore';
import type { UpdaterProviderProps } from './UpdaterProvider.type';

const UpdaterProvider = (props: UpdaterProviderProps) => {
  const { children } = props;
  const connect = useUpdaterStore((s) => s.connect);

  useEffect(() => connect(), [connect]);
  useEscapeLayer(UPDATER_ESCAPE_LAYER);

  return (
    <>
      {children}
      <UpdateDialog />
    </>
  );
};

export { UpdaterProvider };
