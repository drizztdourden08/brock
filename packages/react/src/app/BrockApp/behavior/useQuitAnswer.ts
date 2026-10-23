/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { hostApi } from '../../../host/host-api';
import { answerQuit } from '../../../quit/answer-quit';
import { quitGuards } from '../../../quit/quit-guards';

const useQuitAnswer = (): void => {
  useEffect(() => {
    const api = hostApi();
    if (!api) return undefined;
    const answers = [api.answer('window:confirmQuit', answerQuit), api.answer('window:pingQuit', () => true as const)];
    let last: boolean | null = null;
    const report = (): void => {
      const guarded = quitGuards.count() > 0;
      if (guarded === last) return;
      last = guarded;
      api.setCloseGuarded(guarded);
    };
    const stop = quitGuards.subscribe(report);
    report();
    return () => {
      stop();
      for (const remove of answers) remove();
      api.setCloseGuarded(false);
    };
  }, []);
};

export { useQuitAnswer };
