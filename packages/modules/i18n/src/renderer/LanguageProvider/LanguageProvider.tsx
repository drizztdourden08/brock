/* @layer renderer-shell @kind component */
import { useProfileLanguage } from './behavior/useProfileLanguage';
import type { LanguageProviderProps } from './LanguageProvider.type';

const LanguageProvider = ({ children }: LanguageProviderProps) => {
  useProfileLanguage();
  return <>{children}</>;
};

export { LanguageProvider };
