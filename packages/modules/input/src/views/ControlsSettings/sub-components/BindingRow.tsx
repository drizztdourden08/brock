/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import { Box, Icon, IconButton, Image, Text } from '@drizztdourden08/tessera/primitives';
import { bindingGlyphKeys, getBindingLabel } from '../../../bindings';
import { useGlyphSourceStore } from '../../../renderer/useGlyphSourceStore';
import { glyphUrl } from '../behavior/glyph-url';
import type { BindingRowProps } from './BindingRow.type';
import './BindingRow.css';

const BindingRow = (props: BindingRowProps) => {
  const { actionLabel, middleLabel, middleGlyph, binding, bindingIcon, deviceIconUrl, labels, onRebind, onClear } = props;
  const sources = useGlyphSourceStore((state) => state.sources);
  const bindingLabel = getBindingLabel(binding, bindingIcon);
  const bindingIconSrc = glyphUrl(bindingGlyphKeys(binding, bindingIcon), sources);
  const middleIconSrc = middleGlyph ? glyphUrl([middleGlyph], sources) : null;
  const isNone = binding.type === 'none';

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRebind(); }
  }, [onRebind]);
  const handleClear = useCallback((e: MouseEvent) => { e.stopPropagation(); onClear?.(); }, [onClear]);

  return (
    <Box className="binding-row" role="button" tabIndex={0} title={labels.rebind(actionLabel)} onClick={onRebind} onKeyDown={handleKeyDown}>
      <Text className="binding-row__action-label">{actionLabel}</Text>
      <Box className="binding-row__rest">
        <Box className="binding-row__icon-slot">
          {middleIconSrc ? <Image src={middleIconSrc} alt={middleLabel ?? ''} className="binding-row__icon-img" /> : null}
        </Box>
        <Text className="binding-row__middle-label">{middleLabel ?? ''}</Text>
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
          <IconButton variant="ghost" tone="danger" size="xs" className="binding-row__clear" label={labels.clear} onClick={handleClear}>
            <Icon name="x" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export { BindingRow };
