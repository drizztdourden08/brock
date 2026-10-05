/* @layer renderer-shell @kind component */
import { AnimatedMascot } from '@drizztdourden08/tessera/brand';
import { useNoMatchClip } from '../behavior/useNoMatchClip';
import type { NoMatchMascotProps } from './NoMatchMascot.type';

const NoMatchMascot = (props: NoMatchMascotProps) => {
  const { mascot, query } = props;
  const { animation, onFinish } = useNoMatchClip(query);
  return <AnimatedMascot brand={mascot} animation={animation} onFinish={onFinish} size="lg" />;
};

export { NoMatchMascot };
