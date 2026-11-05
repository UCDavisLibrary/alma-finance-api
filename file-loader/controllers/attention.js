const { processingFailure } = require('./processing-status');

// Dependencies are passed in so the scanner can be tested without external services.
exports.scanProcessingFailures = async ({ db, checkPayments, transporter, logMessage }) => {
  const [invoices] = await db.execute("SELECT * FROM invoices WHERE status <> 'PAID' AND consumerTrackingId IS NOT NULL");
  for (const invoice of invoices) {
    try {
      const results = await checkPayments([{ consumerTrackingId: invoice.consumerTrackingId }]);
      const response = results?.[0];
      const status = response?.data?.scmInvoicePaymentRequestStatusByConsumerTracking;
      // Transport/GraphQL errors do not establish an invoice processing failure.
      if (!status || response.errors?.length) {
        logMessage('WARNING', 'Unable to check Boundary processing status', { invoiceid: invoice.invoiceid });
        continue;
      }
      const snapshot = JSON.stringify(status);
      const failure = processingFailure(status);
      await db.execute(
        'UPDATE invoice_submission_attempts SET boundaryStatus = ? WHERE consumerTrackingId = ?',
        [snapshot, invoice.consumerTrackingId]
      );
      if (!failure) continue;
      await db.execute(
        "UPDATE invoices SET status = 'NEEDS_ATTENTION', boundaryStatus = ?, failureSummary = ?, failureDetectedAt = COALESCE(failureDetectedAt, UTC_TIMESTAMP()) WHERE id = ? AND consumerTrackingId = ? AND status <> 'PAID'",
        [snapshot, failure, invoice.id, invoice.consumerTrackingId]
      );
    } catch (error) {
      logMessage('WARNING', 'Boundary processing check failed', { invoiceid: invoice.invoiceid, error: error.message });
    }
  }

  // Notification retries are independent of whether today's Boundary lookup succeeds.
  const [pending] = await db.execute("SELECT * FROM invoices WHERE status = 'NEEDS_ATTENTION' AND failureNotifiedAt IS NULL");
  for (const invoice of pending) {
    try {
      const [users] = await db.execute('SELECT DISTINCT email FROM users WHERE `library` = ? AND email <> ?', [invoice.library, '']);
      const recipients = users.map(user => user.email).filter(Boolean);
      if (!recipients.length) throw new Error(`No email recipients configured for ${invoice.library}`);
      const baseUrl = (process.env.APP_URL || '').replace(/\/$/, '');
      if (!baseUrl) throw new Error('APP_URL is required for invoice notification links');
      const result = await transporter.sendMail({
        subject: `Invoice ${invoice.invoicenumber} needs attention`,
        from: 'no-reply@ucdavis.edu',
        to: recipients,
        text: `Invoice ${invoice.invoicenumber} (${invoice.library}) failed processing after submission.\nTracking ID: ${invoice.consumerTrackingId}\nDetected: ${invoice.failureDetectedAt}\n\n${invoice.failureSummary}\n\nReview and correct the invoice before resubmitting:\n${baseUrl}/invoice/${encodeURIComponent(invoice.invoiceid)}`,
      });
      if (result.rejected?.length) throw new Error('One or more notification recipients were rejected');
      await db.execute(
        "UPDATE invoices SET failureNotifiedAt = UTC_TIMESTAMP() WHERE id = ? AND consumerTrackingId = ? AND status = 'NEEDS_ATTENTION'",
        [invoice.id, invoice.consumerTrackingId]
      );
    } catch (error) {
      logMessage('WARNING', 'Invoice attention notification failed; will retry next scan', { invoiceid: invoice.invoiceid, error: error.message });
    }
  }
};
