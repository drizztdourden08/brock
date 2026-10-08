/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import { inputApi } from '../../input-api';

const useInputHost = (): void => {
  useState(inputApi);
};

export { useInputHost };
