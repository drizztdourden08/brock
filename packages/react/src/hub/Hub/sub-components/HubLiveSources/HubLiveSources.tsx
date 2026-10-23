/* @layer renderer-shell @kind component */
import { NO_LIVE } from '../../../hub.constants';
import type { HubLiveNodeProps, HubLiveSourcesProps } from './HubLiveSources.type';

const HubLiveNode = (props: HubLiveNodeProps) => {
  const { entry, children } = props;
  return children(entry.source.usePages());
};

const HubLiveSources = (props: HubLiveSourcesProps) => {
  const { sources, lists = NO_LIVE, children } = props;
  const [head, ...rest] = sources;
  if (head === undefined) return children(lists);
  return (
    <HubLiveNode entry={head}>
      {(items) => <HubLiveSources sources={rest} lists={{ ...lists, [head.id]: items }}>{children}</HubLiveSources>}
    </HubLiveNode>
  );
};

export { HubLiveSources };
