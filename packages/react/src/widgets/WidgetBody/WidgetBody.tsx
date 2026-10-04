/* @layer renderer-shell @kind component */
import { RenderErrorBoundary } from '../../errors/RenderErrorBoundary';
import { WidgetIdContext } from '../widget-id-context';
import { widgetErrorLabel } from '../widget-error-label';
import type { WidgetBodyProps } from './WidgetBody.type';

const WidgetBody = (props: WidgetBodyProps) => {
  const { id, label, children } = props;
  return (
    <WidgetIdContext.Provider value={id}>
      <RenderErrorBoundary scope={`Widget ${id}`} label={widgetErrorLabel(label)}>{children}</RenderErrorBoundary>
    </WidgetIdContext.Provider>
  );
};

export { WidgetBody };
