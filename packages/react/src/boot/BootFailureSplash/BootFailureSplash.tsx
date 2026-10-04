/* @layer renderer-shell @kind component */
import { Splash } from '@drizztdourden08/tessera/primitives';
import { useBrock } from '../../app/useBrock';
import { useAppVersion } from '../../diagnostics/useAppVersion';
import { failureTitle } from './behavior/failure-title';
import { useFailureActions } from './behavior/useFailureActions';
import type { BootFailureSplashProps } from './BootFailureSplash.type';
import './BootFailureSplash.css';

const BootFailureSplash = (props: BootFailureSplashProps) => {
  const { failure } = props;
  const { product } = useBrock();
  const version = useAppVersion();
  const actions = useFailureActions();
  if (failure === null) return null;
  return (
    <Splash
      className="boot-failure-splash"
      title={product.window.title ?? product.name}
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
