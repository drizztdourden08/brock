/* @layer renderer-shell @kind component */
import { DropZone } from '@drizztdourden08/tessera/primitives';
import type { RomPickerProps } from './RomPicker.type';
import { useRomDrop } from './behavior/useRomDrop';

const RomPicker = ({ extensions, onRom, label = 'Drop your ROM here', hint, disabled = false }: RomPickerProps) => {
  const handleDrop = useRomDrop(onRom);
  return (
    <DropZone
      accept={extensions}
      label={label}
      hint={hint ?? extensions.join(', ')}
      disabled={disabled}
      onDrop={handleDrop}
    />
  );
};

export { RomPicker };
