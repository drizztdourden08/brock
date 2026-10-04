/* @layer electron-main @kind logic */
import type { JobHandle } from '../jobs/job.type';
import type { DataDomains } from './domain-files.type';
import type { TransferReport } from './transfer.type';

const stepReporter = (job: JobHandle, domains: DataDomains): TransferReport => {
  let current: string | null = null;
  return (domain, done, total) => {
    const { label } = domains.def(domain);
    if (domain !== current) {
      current = domain;
      job.step(domain);
      job.log(`${label}: ${total} file${total === 1 ? '' : 's'}`);
    }
    job.progress(total > 0 ? done / total : 1, `${label}: ${done} of ${total} files`);
  };
};

export { stepReporter };
