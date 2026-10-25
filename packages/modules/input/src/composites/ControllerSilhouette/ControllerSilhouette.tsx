/* @layer renderer-components @kind component */
import { Box, Svg, SvgPath, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import { CONTROLLER_SILHOUETTE_PATHS, CONTROLLER_SILHOUETTE_VIEW_BOX } from './behavior/outlines.constants';
import type { ControllerSilhouetteProps } from './ControllerSilhouette.type';
import './ControllerSilhouette.css';

const ControllerSilhouette = ({ variant, label, className = '', children }: ControllerSilhouetteProps) => {
  const { controller } = useTesseraStrings();

  return (
    <Box
      as="figure"
      aria-label={label ?? controller.controller}
      className={`controller-outline${className ? ` ${className}` : ''}`}
      data-variant={variant}
    >
      <Svg className="controller-outline__art" viewBox={CONTROLLER_SILHOUETTE_VIEW_BOX} aria-hidden="true" focusable="false">
        <SvgPath className="controller-outline__line" d={CONTROLLER_SILHOUETTE_PATHS[variant]} />
        {children}
      </Svg>
    </Box>
  );
};

export { ControllerSilhouette };
