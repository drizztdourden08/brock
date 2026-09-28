/* @layer renderer-shell @kind component */
import { Box, Pressable } from '@drizztdourden08/tessera/primitives';
import type { RailItemProps } from './RailItem.type';

const RailItem = (props: RailItemProps) => {
  const { entry, onSelect } = props;
  const { id, title, icon, active, disabled } = entry;
  return (
    <Pressable
      className={`screen-rail__item${active ? ' screen-rail__item--active' : ''}`}
      onClick={() => onSelect(id)}
      disabled={disabled}
      title={title}
      aria-label={title}
      aria-current={active ? 'page' : undefined}
    >
      <Box as="span" className="screen-rail__icon" aria-hidden="true">{icon}</Box>
      <Box as="span" className="screen-rail__label">{title}</Box>
    </Pressable>
  );
};

export { RailItem };
