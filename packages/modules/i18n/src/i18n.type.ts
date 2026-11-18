/* @layer core @kind types */
type I18nState = {
  readonly locale: string;
  readonly preference: string | null;
  readonly system: string;
  readonly offered: readonly string[];
};

type I18nStateListener = (state: I18nState) => void;

interface I18nApi {
  get: () => Promise<I18nState>;
  set: (preference: string | null) => Promise<I18nState>;
  onChanged: (listener: I18nStateListener) => () => void;
}

export type { I18nApi, I18nState, I18nStateListener };
