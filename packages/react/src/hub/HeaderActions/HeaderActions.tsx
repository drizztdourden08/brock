/* @layer renderer-shell @kind component */
import { Box, Button, SearchInput } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../i18n';
import type { HeaderActionsProps } from './HeaderActions.type';
import './HeaderActions.css';

const HeaderActions = (props: HeaderActionsProps) => {
  const { search, secondary, primary, children } = props;
  const t = useT();
  const text = useText();
  return (
    <Box className="header-actions">
      {search && (
        <SearchInput
          size="sm"
          grow={false}
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder === undefined ? t('brock-app:hub.filter.placeholder') : text(search.placeholder)}
          aria-label={search.placeholder === undefined ? t('brock-app:hub.filter.label') : text(search.placeholder)}
        />
      )}
      {children}
      {secondary && <Button variant="secondary" size="sm" icon={secondary.icon} onClick={secondary.onClick}>{text(secondary.label)}</Button>}
      {primary && <Button variant="primary" size="sm" icon={primary.icon} onClick={primary.onClick}>{text(primary.label)}</Button>}
    </Box>
  );
};

export { HeaderActions };
