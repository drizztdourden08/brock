/* @layer renderer-components @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { BindingSectionProps } from './BindingSection.type';
import './BindingSection.css';

const BindingSection = (props: BindingSectionProps) => {
  const { title, dragOver, onDragOver, onDragLeave, onDrop, children } = props;
  return (
    <Box
      className={`binding-section ${dragOver ? 'binding-section--drag-over' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {title && <Box className="binding-section__header">{title}</Box>}
      <Box className="binding-section__list">{children}</Box>
    </Box>
  );
};

export { BindingSection };
