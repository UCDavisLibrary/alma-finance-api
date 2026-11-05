-- Run once against the application database before deploying the app and file-loader.
ALTER TABLE invoices
  ADD COLUMN boundaryStatus LONGTEXT NULL,
  ADD COLUMN failureSummary TEXT NULL,
  ADD COLUMN failureDetectedAt DATETIME NULL,
  ADD COLUMN failureNotifiedAt DATETIME NULL;

CREATE TABLE invoice_submission_attempts (
  id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  invoiceid VARCHAR(20) NOT NULL,
  consumerTrackingId VARCHAR(100) NOT NULL,
  `library` VARCHAR(6) NOT NULL,
  submittedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responsebody LONGTEXT NULL,
  boundaryStatus LONGTEXT NULL,
  UNIQUE KEY tracking_id (consumerTrackingId),
  KEY invoice_history (invoiceid, `library`)
);

INSERT IGNORE INTO invoice_submission_attempts
  (invoiceid, consumerTrackingId, `library`, submittedAt, responsebody)
SELECT invoiceid, consumerTrackingId, `library`, datetime, responsebody
FROM invoices WHERE consumerTrackingId IS NOT NULL AND consumerTrackingId <> '';
