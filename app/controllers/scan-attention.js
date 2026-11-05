import { processingFailure } from './processing-status.js';

// Login checks update the queue only. Email remains the nightly job's responsibility.
export function createAttentionScanner({ db, checkPayments, logMessage }) {
  return async library => {
    const [invoices] = await db.execute(
      "SELECT id, consumerTrackingId FROM invoices WHERE `library` = ? AND status <> 'PAID' AND consumerTrackingId IS NOT NULL AND consumerTrackingId <> ''",
      [library]
    );
    if (!invoices.length) return;
    const results = await checkPayments(invoices.map(invoice => ({ consumerTrackingId: invoice.consumerTrackingId })));
    const byTrackingId = new Map((results || []).map(result => [result.consumerTrackingId, result]));
    for (const invoice of invoices) {
      const response = byTrackingId.get(invoice.consumerTrackingId);
      const status = response?.data?.scmInvoicePaymentRequestStatusByConsumerTracking;
      if (!status || response.errors?.length) {
        logMessage('WARNING', 'Unable to check invoice processing status at login', { id: invoice.id, library });
        continue;
      }
      const snapshot = JSON.stringify(status);
      await db.execute('UPDATE invoice_submission_attempts SET boundaryStatus = ? WHERE consumerTrackingId = ? AND `library` = ?', [snapshot, invoice.consumerTrackingId, library]);
      const failure = processingFailure(status);
      if (failure) {
        await db.execute(
          "UPDATE invoices SET status = 'NEEDS_ATTENTION', boundaryStatus = ?, failureSummary = ?, failureDetectedAt = COALESCE(failureDetectedAt, UTC_TIMESTAMP()) WHERE id = ? AND consumerTrackingId = ? AND `library` = ? AND status <> 'PAID'",
          [snapshot, failure, invoice.id, invoice.consumerTrackingId, library]
        );
      }
    }
  };
}
