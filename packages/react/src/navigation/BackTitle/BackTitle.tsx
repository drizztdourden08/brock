/* @layer renderer-shell @kind component */
import { Box, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import type { BackTitleProps } from './BackTitle.type';
import './BackTitle.css';

const BackTitle = (props: BackTitleProps) => {
  const { title, label = 'Back', onBack } = props;
  return (
    <Box as="span" className="back-title">
      <IconButton variant="ghost" size="sm" label={label} className="back-title__button" onClick={onBack}>
        <Icon name="arrow-left" size={16} />
      </IconButton>
      <Box as="span" className="back-title__text">{title}</Box>
    </Box>
  );
};

export { BackTitle };
