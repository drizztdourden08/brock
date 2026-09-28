/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { SDL_BUTTON_NAMES } from '../../../input.constants';
import type { ButtonGridProps } from './ButtonGrid.type';
import './ButtonGrid.css';

const labelOf = (label: string | undefined, name: string): string => (label === undefined || label === '' ? name : label);

const ButtonGrid = (props: ButtonGridProps) => {
  const { buttons, hasButton, labels } = props;
  const present = SDL_BUTTON_NAMES.map((name, index) => ({ name, index })).filter(({ index }) => hasButton[index]);

  return (
    <Box className="button-grid">
      {present.map(({ name, index }) => (
        <Box
          key={name}
          title={name}
          className={`button-grid__cell${buttons[index] ? ' button-grid__cell--pressed' : ''}`}
        >
          <Text className="button-grid__label">{labelOf(labels[index], name)}</Text>
        </Box>
      ))}
    </Box>
  );
};

export { ButtonGrid };
