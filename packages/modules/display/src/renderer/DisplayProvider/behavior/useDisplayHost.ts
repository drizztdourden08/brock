/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import { displayApi } from '../../display-api';

const useDisplayHost = (): void => {
  useState(displayApi);
};

export { useDisplayHost };
