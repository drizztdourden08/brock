/* @layer renderer-shell @kind component */
import { Anchored, Box, Image, Pressable, Text } from '@drizztdourden08/tessera/primitives';
import { useAnchorRef } from '../../hooks/useAnchorRef';
import type { ChoiceOption, ChoicePopoverProps } from './ChoicePopover.type';
import './ChoicePopover.css';

const toneClass = (option: ChoiceOption): string =>
  (option.tone && option.tone !== 'plain' ? ` choice-popover__row--${option.tone}` : '');

const ChoicePopover = (props: ChoicePopoverProps) => {
  const { title, options, anchor, onClose, allLabel, currentLabel = 'current' } = props;
  const anchorRef = useAnchorRef(anchor);

  return (
    <Anchored anchorRef={anchorRef} placement="bottom-start" layer="popover" className="choice-popover" role="menu" aria-label={title} onDismiss={onClose}>
      <Text className="choice-popover__title">{title}</Text>
      {options.map((option) => (
        <Pressable
          key={option.key}
          role="menuitem"
          className={`choice-popover__row${toneClass(option)}`}
          data-current={option.current ? '' : undefined}
          title={option.hint}
          onClick={() => { option.onPick(); onClose(); }}
        >
          {option.sprite
            ? <Image className="choice-popover__sprite" src={option.sprite} alt="" draggable={false} />
            : <Box className="choice-popover__sprite choice-popover__sprite--none" />}
          <Text className="choice-popover__label">{option.label}</Text>
          {option.current && <Text className="choice-popover__current">{currentLabel}</Text>}
          {option.onPickAll && allLabel && (
            <Text
              as="span"
              role="button"
              className="choice-popover__all"
              title={option.allHint}
              onClick={(e) => { e.stopPropagation(); option.onPickAll?.(); onClose(); }}
            >
              {allLabel}
            </Text>
          )}
        </Pressable>
      ))}
    </Anchored>
  );
};

export { ChoicePopover };
