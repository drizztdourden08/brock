/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../../../host/host-api';
import { quitGuards } from '../../../quit/quit-guards';

const useQuitAnswer = (): void => {
  useEffect(() => hostApi()?.answer('window:confirmQuit', () => quitGuards.decide()), []);
};

export { useQuitAnswer };
