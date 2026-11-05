/* @layer renderer-shell @kind component */
import { OptionTabBody } from '../../../OptionTabBody';
import type { TabBodyProps } from './TabBody.type';

const TabBody = ({ tab, ...props }: TabBodyProps) => (tab.Body ? <tab.Body {...props} /> : <OptionTabBody tab={tab} {...props} />);

export { TabBody };
