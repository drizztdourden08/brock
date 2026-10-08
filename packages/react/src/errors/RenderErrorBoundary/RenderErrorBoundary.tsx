/* @layer renderer-shell @kind component */
import { ErrorBoundary } from '@drizztdourden08/tessera/composites';
import { PAGE_ERROR_LABEL } from '../errors.constants';
import { reportRenderError } from '../report-render-error';
import { reportRenderRetry } from '../report-render-retry';
import { RenderErrorActions } from './sub-components/RenderErrorActions';
import type { RenderErrorBoundaryProps } from './RenderErrorBoundary.type';
import './RenderErrorBoundary.css';

const RenderErrorBoundary = (props: RenderErrorBoundaryProps) => {
  const { scope, label = PAGE_ERROR_LABEL, onHome, resetKey, children } = props;
  return (
    <ErrorBoundary
      label={label}
      resetKey={resetKey}
      className="render-error"
      action={<RenderErrorActions onHome={onHome} />}
      onRetry={() => reportRenderRetry(scope)}
      onError={(error, info) => reportRenderError(scope, error, info)}
    >
      {children}
    </ErrorBoundary>
  );
};

export { RenderErrorBoundary };
