---
'@drizztdourden08/brock-react': patch
---

The review's `title-bar-actions-sm` check leaves out title bar status items (`bar: 'status'`, such as the job status a hidden job shows): they are text, not `sm` icon buttons, so a job running during the review no longer fails the check.
