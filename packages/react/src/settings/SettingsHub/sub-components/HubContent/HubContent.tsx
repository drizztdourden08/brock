/* @layer renderer-shell @kind component */
import { SettingsPageContext } from '../../../SettingsLayout/behavior/settings-page-context';
import { HubSearchResults } from '../HubSearchResults';
import { HubTabContent } from '../HubTabContent';
import type { HubContentProps } from './HubContent.type';

const HubContent = <S extends object>(props: HubContentProps<S>) => {
  const { searching, query, tabs, active, pageContext, onOpenTab, ...control } = props;
  if (searching) return <HubSearchResults tabs={tabs} query={query} onOpenTab={onOpenTab} {...control} />;
  if (!active || !pageContext) return null;
  return (
    <SettingsPageContext.Provider value={pageContext}>
      <HubTabContent tab={active} {...control} />
    </SettingsPageContext.Provider>
  );
};

export { HubContent };
