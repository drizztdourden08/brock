/* @layer renderer-shell @kind component */
import { Anchored, Text } from '@drizztdourden08/tessera/primitives';
import type { AnchoredCardProps } from './AnchoredCard.type';
import './AnchoredCard.css';

const AnchoredCard = (props: AnchoredCardProps) => {
  const { anchorRef, title, role, onDismiss, children, className } = props;
  return (
    <Anchored
      anchorRef={anchorRef}
      placement="bottom-start"
      layer="popover"
      className={className ? `anchored-card ${className}` : 'anchored-card'}
      role={role}
      aria-label={title}
      onDismiss={onDismiss}
    >
      <Text className="anchored-card__title">{title}</Text>
      {children}
    </Anchored>
  );
};

export { AnchoredCard };
