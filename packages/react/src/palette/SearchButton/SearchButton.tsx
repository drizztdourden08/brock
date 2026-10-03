/* @layer renderer-shell @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { palette } from '../palette';
import { usePaletteOpen } from '../usePaletteOpen';
import type { SearchButtonProps } from './SearchButton.type';
import './SearchButton.css';

const SearchButton = (props: SearchButtonProps) => {
  const { className = '' } = props;
  const open = usePaletteOpen();
  return (
    <IconButton
      variant="ghost"
      size="sm"
      active={open}
      label="Search (Ctrl+K)"
      className={`search-button${className ? ` ${className}` : ''}`}
      onClick={palette.toggle}
    >
      <Icon name="search" effect="twinkle" size={14} className="search-glass" />
    </IconButton>
  );
};

export { SearchButton };
