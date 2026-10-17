/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { bodyHolds } from './body-holds';

const useBodyMounted = (key: string): void => {
  useEffect(() => bodyHolds.mounted(key), [key]);
};

export { useBodyMounted };
