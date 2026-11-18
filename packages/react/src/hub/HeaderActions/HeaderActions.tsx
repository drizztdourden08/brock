/* @layer renderer-shell @kind component */
import { Box, Button, SearchInput } from '@drizztdourden08/tessera/primitives';
import { useT } from '../../i18n';
import type { HeaderActionsProps } from './HeaderActions.type';
import './HeaderActions.css';

const HeaderActions = (props: HeaderActionsProps) => {
  const { search, secondary, primary, children } = props;
  const t = useT();
  return (
    <Box className="header-actions">
      {search && (
        <SearchInput
          size="sm"
          grow={false}
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder ?? t('brock-app:hub.filter.placeholder')}
          aria-label={search.placeholder ?? t('brock-app:hub.filter.label')}
        />
      )}
      {children}
      {secondary && <Button variant="secondary" size="sm" icon={secondary.icon} onClick={secondary.onClick}>{secondary.label}</Button>}
      {primary && <Button variant="primary" size="sm" icon={primary.icon} onClick={primary.onClick}>{primary.label}</Button>}
    </Box>
  );
};

export { HeaderActions };
