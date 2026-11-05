/* @layer renderer-shell @kind logic */
import type { ControllerReportPayload, ControllerReportSubmission } from '../controller-report.type';
import type { ReportRequestParams } from './build-report-request.type';

const buildDescription = (params: Pick<ReportRequestParams, 'identity' | 'name' | 'additionalInfo'>): string => {
  const { identity, name, additionalInfo } = params;
  return [
    !identity && name.trim() ? `Reported by: ${name.trim()}` : null,
    additionalInfo.trim() || 'No additional info provided.',
  ].filter(Boolean).join('\n\n');
};

const buildControllerReport = (params: ReportRequestParams): ControllerReportPayload => {
  const { detection, calibrationMap, positionalRecords, diagnosticsReport } = params;
  return {
    detectedName: detection.detectedName,
    sdlMatch: detection.sdlMatch,
    inputApi: detection.inputApi,
    vendorId: detection.vendorId,
    productId: detection.productId,
    hidReport: detection.hidReport,
    calibrationMap: JSON.stringify(calibrationMap, null, 2),
    ...(positionalRecords.length > 0 && { positionalCapture: JSON.stringify(positionalRecords, null, 2) }),
    ...(diagnosticsReport && { diagnosticsReport: JSON.stringify(diagnosticsReport, null, 2) }),
  };
};

const buildReportRequest = (params: ReportRequestParams): ControllerReportSubmission => {
  const { subjectPrefix, identity, email, detection, debugText } = params;
  return {
    subject: `${subjectPrefix}Controller ${detection.detectedName} (${detection.vendorId}:${detection.productId})`,
    description: buildDescription(params),
    debugInfo: debugText,
    contactEmail: identity ? null : email.trim(),
    controllerReport: buildControllerReport(params),
  };
};

export { buildReportRequest };
