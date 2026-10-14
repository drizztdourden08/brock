/* @layer renderer-shell @kind logic */
import { EMAIL_SHAPE } from './bug-report.constants';

const isEmail = (text: string): boolean => EMAIL_SHAPE.test(text.trim());

export { isEmail };
