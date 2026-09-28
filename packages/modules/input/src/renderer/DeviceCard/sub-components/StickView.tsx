/* @layer renderer-shell @kind component */
import { Flex, Svg, SvgCircle, SvgLine, Text } from '@drizztdourden08/tessera/primitives';
import type { StickViewProps } from './StickView.type';
import './StickView.css';

const StickView = (props: StickViewProps) => {
  const { label, point, calibrated } = props;

  return (
    <Flex direction="column" align="center" gap="xs" className="stick-view">
      <Svg className="stick-view__plot" viewBox="-1.2 -1.2 2.4 2.4" role="img" aria-label={label}>
        <SvgCircle className="stick-view__ring" cx={0} cy={0} r={1} vectorEffect="non-scaling-stroke" />
        <SvgLine className="stick-view__axis" x1={-1} y1={0} x2={1} y2={0} vectorEffect="non-scaling-stroke" />
        <SvgLine className="stick-view__axis" x1={0} y1={-1} x2={0} y2={1} vectorEffect="non-scaling-stroke" />
        <SvgCircle className="stick-view__dot" cx={point.x} cy={point.y} r={0.14} />
      </Svg>
      <Text className="stick-view__label">{label}</Text>
      <Text className="stick-view__value">
        {`${point.x.toFixed(2)}, ${point.y.toFixed(2)}${calibrated ? ' cal' : ''}`}
      </Text>
    </Flex>
  );
};

export { StickView };
