/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { contexts } from './contexts';

const useSetAppContext = <T>(name: string, active: boolean, data?: T): void => {
  useEffect(() => {
    contexts.set(name, data === undefined ? { active } : { active, data });
  }, [name, active, data]);
  useEffect(() => () => contexts.set(name, { active: false }), [name]);
};

export { useSetAppContext };
