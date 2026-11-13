/* @layer renderer-components @kind component */
import { BindingListener } from './BindingListener';
import type { ControlsListenerProps } from './ControlsListener.type';

const ControlsListener = ({ game, ctrl }: ControlsListenerProps) => {
  const { listeningFor, listeningName, labels } = ctrl;
  if (!listeningFor || !listeningName) return null;
  return (
    <BindingListener
      actionLabel={listeningName}
      prompt={labels.listenerPrompt}
      hint={labels.listenerHint}
      extra={game.listenerExtra?.({ target: listeningFor, capture: ctrl.handleCapture, close: ctrl.cancelListening })}
      fullscreen={game.listenerFullscreen?.(listeningFor) ?? false}
      onCapture={ctrl.handleCapture}
      onCancel={ctrl.cancelListening}
    />
  );
};

export { ControlsListener };
