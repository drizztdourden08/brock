/* @layer renderer-shell @kind component */
import { useBootStore } from '../useBootStore';
import type { BootGateProps } from './BootGate.type';

const BootGate = (props: BootGateProps) => {
  const { children } = props;
  const failed = useBootStore((s) => s.phase === 'failed');
  return failed ? null : children;
};

export { BootGate };
