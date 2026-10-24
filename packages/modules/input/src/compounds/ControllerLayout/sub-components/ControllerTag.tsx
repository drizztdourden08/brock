/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import { tagStyle } from '../behavior/tag-style';
import type { ControllerTagProps } from '../ControllerLayout.type';

const ControllerTag = (props: ControllerTagProps) => {
  const { place, state, active } = props;
  const content = state?.glyph ?? state?.label;
  if (content === undefined || content === '') return null;

  return (
    <Box
      as="span"
      className="input-controller-layout__tag"
      data-at={place.tag.at}
      data-kind={place.kind}
      data-active={active ? '' : undefined}
      style={tagStyle(place.tag)}
    >
      {content}
    </Box>
  );
};

export { ControllerTag };
