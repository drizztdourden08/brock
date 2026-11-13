/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import type { MouseEvent } from 'react';
import { Box, Icon, IconButton, Image, Text } from '@drizztdourden08/tessera/primitives';
import { bindingGlyphKeys, getBindingLabel } from '../../../bindings';
import { useGlyphSourceStore } from '../../../renderer/useGlyphSourceStore';
import { glyphUrl } from '../behavior/glyph-url';
import type { BindingValueProps } from './BindingValue.type';
import './BindingValue.css';

const BindingValue = ({ binding, bindingIcon, deviceIconUrl, clearLabel, onClear }: BindingValueProps) => {
  const sources = useGlyphSourceStore((state) => state.sources);
  const bindingLabel = getBindingLabel(binding, bindingIcon);
  const bindingIconSrc = glyphUrl(bindingGlyphKeys(binding, bindingIcon), sources);
  const isNone = binding.type === 'none';
  const handleClear = useCallback((e: MouseEvent) => { e.stopPropagation(); onClear?.(); }, [onClear]);

  return (
    <>
      <Box className="binding-row__icon-slot">
        {bindingIconSrc ? <Image src={bindingIconSrc} alt={bindingLabel} className="binding-row__icon-img" /> : null}
      </Box>
      {deviceIconUrl && (
        <Box className="binding-row__device-icon-slot">
          <Image src={deviceIconUrl} alt="" className="binding-row__device-icon-img" />
        </Box>
      )}
      <Text className={`binding-row__binding-label ${isNone ? 'binding-row__binding-label--none' : ''}`}>{bindingLabel}</Text>
      {onClear && !isNone && (
        <IconButton variant="ghost" tone="danger" size="xs" className="binding-row__clear" label={clearLabel} onClick={handleClear}>
          <Icon name="x" />
        </IconButton>
      )}
    </>
  );
};

export { BindingValue };
