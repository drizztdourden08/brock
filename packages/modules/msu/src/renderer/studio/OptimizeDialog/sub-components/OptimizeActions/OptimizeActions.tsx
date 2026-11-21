/* @layer renderer-shell @kind component */
import { useT } from '@drizztdourden08/brock-react';
import { Button } from '@drizztdourden08/tessera/primitives';
import type { OptimizeActionsProps } from './OptimizeActions.type';

const OptimizeActions = (props: OptimizeActionsProps) => {
  const { step, convertibleCount, convert, retry, onClose } = props;
  const t = useT();

  if (step === 'result') return <Button variant="primary" onClick={onClose}>{t('msu:optimize.done')}</Button>;

  return (
    <>
      {step !== 'converting' && (
        <Button variant="tertiary" onClick={onClose}>{t('msu:optimize.close')}</Button>
      )}
      {step === 'error' && (
        <Button variant="primary" onClick={() => { void retry(); }}>{t('msu:optimize.retry')}</Button>
      )}
      {step === 'preview' && convertibleCount > 0 && (
        <Button variant="primary" onClick={() => { void convert(); }}>
          Convert {convertibleCount} file{convertibleCount === 1 ? '' : 's'}
        </Button>
      )}
    </>
  );
};

export { OptimizeActions };
