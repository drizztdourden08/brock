/* @layer renderer-shell @kind hook */
import { useState } from 'react';
import { hostInputApi } from '../../host-input-api';

const useInputHost = (): void => {
  useState(hostInputApi);
};

export { useInputHost };
