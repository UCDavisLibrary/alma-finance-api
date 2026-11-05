// Boundary can accept a request and reject it later during Oracle import.
function processingFailure(status) {
  if (!status) return null;
  const jobs = status.processingResult?.jobs || [];
  const failedJobs = jobs.filter(job => job.jobStatus === 'ERROR');
  if (status.requestStatus?.requestStatus !== 'ERROR' &&
      status.processingResult?.status !== 'ERROR' && !failedJobs.length) return null;

  const messages = [
    ...(status.requestStatus?.errorMessages || []),
    ...(status.processingResult?.errorMessages || []),
    ...failedJobs.map(job => `${job.jobId}: ${job.failedRecords || job.jobReport || 'Processing failed'}`),
  ];
  return [...new Set(messages)].join('\n') || 'Boundary processing failed.';
}

module.exports = { processingFailure };
