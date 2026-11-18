/* @layer renderer-shell @kind component */
import { Fragment } from 'react';
import type { MessageKey } from '@drizztdourden08/brock-core/i18n';
import { useI18n } from '../useI18n';
import type { TransProps } from './Trans.type';

const Trans = <K extends MessageKey>({ k, values, tags }: TransProps<K>) => {
  const { i18n } = useI18n();
  const pieces = i18n.parts(k, values, tags);
  return <>{pieces.map((piece, index) => <Fragment key={index}>{piece}</Fragment>)}</>;
};

export { Trans };
