/* @layer renderer-shell @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';

const OPENED_MESSAGE = msg('brock-app:bugReport.opened');
const COPIED_MESSAGE = msg('brock-app:bugReport.copied');
const COPY_FAILED_MESSAGE = msg('brock-app:bugReport.copyFailed');
const SENT_MESSAGE = msg('brock-app:bugReport.sentMessage');
const OPEN_RECEIPT_LABEL = msg('brock-app:bugReport.openReceipt');
const SENDING_LABEL = msg('brock-app:bugReport.sending');
const CLIPBOARD_NOTE = msg('brock-app:bugReport.clipboardNote');
const DESCRIPTION_ROWS = 6;
const ATTACH_FILES_LABEL = msg('brock-app:bugReport.attach.add');
const CONTACT_HINT = msg('brock-app:bugReport.contact.hint');
const FALLBACK_LABEL = msg('brock-app:bugReport.fallback');
const REPORT_TITLE = msg('brock-app:bugReport.title');
const SENT_TITLE = msg('brock-app:bugReport.sentTitle');
const CANCEL_LABEL = msg('brock-app:bugReport.cancel');
const CLOSE_LABEL = msg('brock-app:bugReport.close');
const RETRY_LABEL = msg('brock-app:bugReport.retry');

export {
  ATTACH_FILES_LABEL, CANCEL_LABEL, CLIPBOARD_NOTE, CLOSE_LABEL, CONTACT_HINT, COPIED_MESSAGE, COPY_FAILED_MESSAGE, DESCRIPTION_ROWS, FALLBACK_LABEL,
  OPEN_RECEIPT_LABEL, OPENED_MESSAGE, REPORT_TITLE, RETRY_LABEL, SENDING_LABEL, SENT_MESSAGE, SENT_TITLE,
};
