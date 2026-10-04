/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { hostApi } from '../host/host-api';

const useWindowSquare = (): boolean => {
  const [square, setSquare] = useState(false);
  useEffect(() => hostApi()?.onWindowSquare(setSquare), []);
  return square;
};

export { useWindowSquare };
