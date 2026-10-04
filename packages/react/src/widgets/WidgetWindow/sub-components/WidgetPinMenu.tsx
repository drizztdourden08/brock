/* @layer renderer-shell @kind component */
import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Box, Icon, IconButton, Span } from '@drizztdourden08/tessera/primitives';
import { DropdownMenu } from '@drizztdourden08/tessera/composites';
import type { MenuGroup } from '@drizztdourden08/tessera/composites';
import { PIN_CHOICES, PIN_TEXT } from '../WidgetWindow.constants';
import type { WidgetPinMenuProps } from '../WidgetWindow.type';

const WidgetPinMenu = (props: WidgetPinMenuProps) => {
  const { pin, onPinChange, host } = props;
  const anchorRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const current = PIN_CHOICES.find((choice) => choice.value === pin) ?? PIN_CHOICES[0];
  const groups = useMemo<MenuGroup[]>(
    () => [{
      id: 'stacking',
      label: PIN_TEXT.menu,
      items: PIN_CHOICES.map((choice) => ({
        id: choice.value, label: choice.label, description: choice.hint, icon: choice.icon, kind: 'check' as const,
        checked: choice.value === pin, onSelect: () => onPinChange(choice.value),
      })),
    }],
    [pin, onPinChange],
  );
  if (!current) return null;
  const title = PIN_TEXT.barTitle(current.label);

  return createPortal(
    <Box ref={anchorRef} className="widget-window__pin" data-pin={pin}>
      {pin === 'top' && <Span className="widget-window__pin-label">{current.short}</Span>}
      <IconButton
        className="widget__btn"
        label={title}
        title={title}
        active={pin === 'top'}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
      >
        <Icon name={current.icon} size={12} />
      </IconButton>
      {open && <DropdownMenu groups={groups} label={PIN_TEXT.menu} anchorRef={anchorRef} side="below" align="end" onClose={() => setOpen(false)} />}
    </Box>,
    host,
  );
};

export { WidgetPinMenu };
