/* @layer renderer-shell @kind hook */
import { createElement, useMemo } from 'react';
import type { ReactNode } from 'react';
import { joinRoute } from '../../../navigation/join-route';
import { nav } from '../../../navigation/nav';
import { ROUTE_SEPARATOR } from '../../../navigation/navigation.constants';
import { useScreenState } from '../../../screens/useScreenState';
import { HeaderActions } from '../../HeaderActions';
import { PAGE_SEARCH_KEY } from '../../hub.constants';
import type { HubPageHeader } from '../../hub.type';

const targetOf = (open: string, route: string): string => (open.includes(ROUTE_SEPARATOR) ? open : joinRoute(route, open));

const useHeaderActions = (header: HubPageHeader | undefined, route: string, slotted: ReactNode): ReactNode => {
  const [query, setQuery] = useScreenState(PAGE_SEARCH_KEY, '');
  return useMemo(() => {
    const { primary, search } = header ?? {};
    if (primary === undefined && search === undefined && slotted == null) return undefined;
    return createElement(HeaderActions, {
      search: search && { value: query, onChange: setQuery, placeholder: search.placeholder },
      primary: primary && { label: primary.label, icon: primary.icon, onClick: () => nav.open(targetOf(primary.open, route)) },
    }, slotted);
  }, [header, route, slotted, query, setQuery]);
};

export { useHeaderActions };
