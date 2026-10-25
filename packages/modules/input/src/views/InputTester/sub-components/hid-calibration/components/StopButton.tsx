/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import type { StopButtonProps } from './ActionButtons.type';

const StopButton = ({ onStop }: StopButtonProps) => <Button variant="danger" size="sm" onClick={onStop}>Stop</Button>;

export { StopButton };
