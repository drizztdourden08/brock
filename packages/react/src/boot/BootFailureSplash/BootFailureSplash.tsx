/* @layer renderer-shell @kind component */
import { Splash } from '@drizztdourden08/tessera/composites';
import { useBrock } from '../../app/useBrock';
import { useAppVersion } from '../../diagnostics/useAppVersion';
import { failureTitle } from './behavior/failure-title';
import { useFailureActions } from './behavior/useFailureActions';
import type { BootFailureSplashProps } from './BootFailureSplash.type';

const BootFailureSplash = (props: BootFailureSplashProps) => {
  const { failure } = props;
  const { product } = useBrock();
  const version = useAppVersion();
  const actions = useFailureActions();
  if (failure === null) return null;
  const { wordmark } = product.icons;
  return (
    <Splash
      title={product.window.title ?? product.name}
      wordmark={wordmark?.dark}
      wordmarkPixelated={wordmark?.rendering === 'pixelated'}
      mark={product.logos.mark}
      status={failureTitle(failure)}
      detail={failure.message}
      failed
      progress={1}
      actions={actions}
      version={`v${version}`}
      data-boot-failure={failure.task}
    />
  );
};

export { BootFailureSplash };
