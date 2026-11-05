/* @layer renderer-shell @kind component */
import { useRandomizerGame } from '../../../game-registry/behavior/useRandomizerGame';
import { formOf } from '../../../wizard/form-of';
import { forwardPatch } from './behavior/forward-patch';
import { ServerFields } from './sub-components/ServerFields';
import type { ConnectionStepBodyProps } from './ConnectionStepBody.type';

const ConnectionStepBody = (props: ConnectionStepBodyProps) => {
  const { values, onChange } = props;
  const form = formOf(values);
  const GameBody = useRandomizerGame()?.views?.connection?.[form.mode];
  if (GameBody) return <GameBody value={form} values={values} onChange={forwardPatch(onChange)} />;
  return <ServerFields {...props} />;
};

export { ConnectionStepBody };
