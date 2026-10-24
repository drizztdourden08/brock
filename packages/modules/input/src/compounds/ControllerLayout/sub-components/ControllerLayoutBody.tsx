/* @layer renderer-shell @kind component */
import { Svg, SvgPath } from '@drizztdourden08/tessera/primitives';
import { isActive } from '../behavior/is-active';
import { stickClickState } from '../behavior/stick-click-state';
import { VIEW_BOX } from '../ControllerLayout.constants';
import { ControllerFill } from './ControllerFill';
import { ControllerOutline } from './ControllerOutline';
import { ControllerStick } from './ControllerStick';
import type { ControllerLayoutBodyProps } from '../ControllerLayout.type';

const ControllerLayoutBody = (props: ControllerLayoutBodyProps) => {
  const { geometry, slots } = props;

  return (
    <Svg className="input-controller-layout__art" viewBox={VIEW_BOX} aria-hidden="true" focusable="false">
      <SvgPath className="input-controller-layout__body" d={geometry.body} />
      {geometry.decor.map((shape, index) => <ControllerOutline key={index} shape={shape} className="input-controller-layout__decor" />)}
      {geometry.places.map((place) => {
        const state = slots[place.id];
        if (place.kind === 'stick') return <ControllerStick key={place.id} place={place} state={state} click={stickClickState(slots, place.id)} />;
        if (place.kind === 'fill') return <ControllerFill key={place.id} place={place} state={state} />;
        return <ControllerOutline key={place.id} shape={place.shape} className="input-controller-layout__control" active={isActive(state)} />;
      })}
    </Svg>
  );
};

export { ControllerLayoutBody };
