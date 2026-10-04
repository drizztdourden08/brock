/* @layer renderer-shell @kind component */
import { Box, Button, SearchInput } from '@drizztdourden08/tessera/primitives';
import type { HeaderActionsProps } from './HeaderActions.type';
import './HeaderActions.css';

const HeaderActions = (props: HeaderActionsProps) => {
  const { search, primary, children } = props;
  return (
    <Box className="header-actions">
      {search && (
        <SearchInput
          size="sm"
          className="header-actions__search"
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder ?? 'Filter'}
          aria-label={search.placeholder ?? 'Filter this page'}
        />
      )}
      {children}
      {primary && <Button variant="primary" size="sm" icon={primary.icon} onClick={primary.onClick}>{primary.label}</Button>}
    </Box>
  );
};

export { HeaderActions };
