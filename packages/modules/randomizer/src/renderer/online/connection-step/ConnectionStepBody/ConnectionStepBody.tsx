/* @layer renderer-shell @kind component */
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import { formOf } from '../../../wizard/form-of';
import { connectionValuesOf } from '../connection-values-of';
import { gameConnectionView } from '../game-connection-view';
import { forwardPatch } from './behavior/forward-patch';
import { ServerFields } from '../ServerFields';
import type { ConnectionStepBodyProps } from './ConnectionStepBody.type';

const ConnectionStepBody = (props: ConnectionStepBodyProps) => {
  const { values, onChange } = props;
  const form = formOf(values);
  const GameBody = gameConnectionView(useRandomizerGame(), form.mode)?.Body;
  if (GameBody) return <GameBody value={connectionValuesOf(values)} values={values} onChange={forwardPatch(onChange)} />;
  return <ServerFields {...props} />;
};

export { ConnectionStepBody };
