/* @layer electron-main @kind types */
import type { FOLDER_TEST_ANSWERS } from './folder-test-answer.constants';

type FolderTestAnswer = (typeof FOLDER_TEST_ANSWERS)[number];

export type { FolderTestAnswer };
