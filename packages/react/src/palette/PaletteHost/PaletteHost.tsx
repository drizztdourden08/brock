/* @layer renderer-shell @kind component */
import { CommandPalette } from '@drizztdourden08/tessera/composites';
import { useBrandMascot } from '../../brand/useBrandMascot';
import { usePaletteShortcut } from './behavior/usePaletteShortcut';
import { useSearchPalette } from './behavior/useSearchPalette';
import { NO_ACTIONS } from './PaletteHost.constants';
import type { PaletteHostProps } from './PaletteHost.type';

const PaletteHost = (props: PaletteHostProps) => {
  const { menu, actions = NO_ACTIONS } = props;
  usePaletteShortcut();
  const mascot = useBrandMascot();
  const { open, query, setQuery, groups, activeIndex, runItem, close } = useSearchPalette(menu, actions);

  return (
    <CommandPalette
      open={open}
      onClose={close}
      query={query}
      onQueryChange={setQuery}
      groups={groups}
      onSelect={runItem}
      activeIndex={activeIndex}
      mascot={mascot}
    />
  );
};

export { PaletteHost };
