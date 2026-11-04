/* @layer renderer-shell @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { DEFAULT_EMPTY_TEXT } from '../GameInfoWidget.constants';
import type { GameInfoEmptyProps } from './GameInfoEmpty.type';

const GameInfoEmpty = ({ text }: GameInfoEmptyProps) => <EmptyState size="sm" message={text ?? DEFAULT_EMPTY_TEXT} />;

export { GameInfoEmpty };
