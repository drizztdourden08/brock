/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import { controllerGeometry } from './behavior/controller-geometry';
import { fallbackRows } from './behavior/fallback-rows';
import { heldLines } from './behavior/held-lines';
import { placedIds } from './behavior/placed-ids';
import { tagSource } from './behavior/tag-source';
import { ControllerHeld } from './sub-components/ControllerHeld';
import { ControllerRows } from './sub-components/ControllerRows';
import { ControllerLayoutBody } from './sub-components/ControllerLayoutBody';
import { ControllerTag } from './sub-components/ControllerTag';
import { CONTROLLER_STRINGS, NO_EXTRAS } from './ControllerLayout.constants';
import type { ControllerLayoutProps } from './ControllerLayout.type';
import './ControllerLayout.css';

const ControllerLayout = (props: ControllerLayoutProps) => {
  const { variant, slots, extras = NO_EXTRAS, label, className = '' } = props;
  const controller = CONTROLLER_STRINGS;
  const geometry = controllerGeometry(variant);
  const placed = useMemo(() => placedIds(geometry), [geometry]);
  const rows = fallbackRows(slots, placed, extras, controller);

  return (
    <Box
      as="figure"
      aria-label={label ?? controller.controller}
      className={`input-controller-layout${className ? ` ${className}` : ''}`}
      data-variant={variant}
    >
      <Box className="input-controller-layout__stage">
        <ControllerLayoutBody geometry={geometry} slots={slots} />
        <Box className="input-controller-layout__tags" aria-hidden="true">
          {geometry.places.map((place) => {
            const source = tagSource(place, slots);
            return <ControllerTag key={place.id} place={place} state={source.state} active={source.active} />;
          })}
        </Box>
      </Box>
      <ControllerHeld lines={heldLines(slots, extras, controller)} label={controller.held} empty={controller.nothingHeld} />
      <ControllerRows rows={rows} label={controller.otherInputs} />
    </Box>
  );
};

export { ControllerLayout };
