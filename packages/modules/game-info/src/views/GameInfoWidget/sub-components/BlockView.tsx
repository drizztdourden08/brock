/* @layer renderer-shell @kind component */
import type { BlockViewProps } from '../GameInfoWidget.type';
import { ListBlock } from './ListBlock';
import { MembersBlock } from './MembersBlock';
import { ProgressBlock } from './ProgressBlock';
import { RowsBlock } from './RowsBlock';

const BlockView = ({ block, prefs }: BlockViewProps) => {
  switch (block.kind) {
    case 'rows': return <RowsBlock block={block} prefs={prefs} />;
    case 'members': return <MembersBlock block={block} />;
    case 'list': return <ListBlock block={block} prefs={prefs} />;
    case 'progress': return <ProgressBlock block={block} prefs={prefs} />;
    case 'custom': return <>{block.render()}</>;
  }
};

export { BlockView };
