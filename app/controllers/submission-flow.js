// Serialize sends for an Alma invoice across app instances, including manual retries.
export function createSubmitInvoice({ db, setSelectedData, reformatAlmaInvoiceforAPI, aggieEnterprisePaymentRequest, randomUUID }) {
  return async function submitInvoice(invoiceid, library, resubmit = false) {
    const connection = await db.getConnection();
    let locked = false;
    let invoice = { id: invoiceid };
    let acceptedTrackingId;
    try {
      const [[lock]] = await connection.execute('SELECT GET_LOCK(?, 0) AS acquired', [`invoice-send:${invoiceid}`]);
      locked = lock.acquired === 1;
      if (!locked) throw new Error('This invoice is already being submitted.');
      const [rows] = await connection.execute('SELECT * FROM invoices WHERE invoiceid = ?', [invoiceid]);
      if (rows.some(row => row.library !== library)) throw new Error('Invoice belongs to another library.');
      if (rows.length > 1) throw new Error('Multiple local records exist for this invoice. Review them before resubmitting.');
      const existing = rows[0];
      if (resubmit && existing?.status !== 'NEEDS_ATTENTION') throw new Error('Invoice is no longer awaiting resubmission. Reload the page.');
      if (!resubmit && existing) throw new Error('Invoice was already submitted. Use Needs Attention to review a failed submission.');

      const source = await setSelectedData([invoiceid]);
      invoice = source?.invoice?.[0] || invoice;
      if (!invoice.vendor || String(invoice.id) !== String(invoiceid)) throw new Error('Unable to retrieve the invoice from Alma.');
      if (invoice.owner?.value !== library) throw new Error('Alma invoice does not belong to the active library.');
      const payloads = await reformatAlmaInvoiceforAPI({ invoice: [invoice] }, library, { fresh: resubmit });
      const payload = payloads[0];
      if (!payload?.data?.payload?.invoiceLines?.length) throw new Error('Unable to build invoice lines. Check vendor and fund data.');
      const trackingId = `${invoice.number}-${randomUUID()}`;
      payload.data.header.consumerTrackingId = trackingId;
      // Save the attempt before dispatch, so a network failure cannot erase its identity.
      await connection.execute(
        'INSERT INTO invoice_submission_attempts (invoiceid, consumerTrackingId, `library`, responsebody) VALUES (?, ?, ?, ?)',
        [invoiceid, trackingId, library, JSON.stringify({ message: 'Submission started' })]
      );
      const responses = await aggieEnterprisePaymentRequest([payload]);
      const response = responses?.[0];
      const created = response?.data?.scmInvoicePaymentCreate;
      if (!response?.errors?.length && !created?.validationResults?.errorMessages?.length && created?.requestStatus?.requestStatus === 'PENDING') acceptedTrackingId = trackingId;
      await connection.execute('UPDATE invoice_submission_attempts SET responsebody = ? WHERE consumerTrackingId = ?',
        [JSON.stringify(response || { errors: [{ message: 'No response from Boundary' }] }), trackingId]);
      if (!response || response.errors?.length) {
        throw new Error((response?.errors || [{ message: 'No response from Boundary' }]).map(error => error.message).join('; ') + ` Tracking ID: ${trackingId}. Check its status before trying again.`);
      }
      const errors = created?.validationResults?.errorMessages || [];
      if (errors.length) throw new Error(errors.join('; '));
      if (created?.requestStatus?.requestStatus !== 'PENDING') throw new Error('Payment request did not return PENDING status.');
      await connection.beginTransaction();
      if (existing) {
        await connection.execute(
          "UPDATE invoices SET invoicenumber = ?, consumerTrackingId = ?, status = 'SENT', responsebody = ?, totalAmount = ?, boundaryStatus = NULL, failureSummary = NULL, failureDetectedAt = NULL, failureNotifiedAt = NULL, datetime = UTC_TIMESTAMP() WHERE id = ?",
          [invoice.number, trackingId, JSON.stringify(response.data), invoice.total_amount, existing.id]
        );
      } else {
        await connection.execute(
          "INSERT INTO invoices (invoicenumber, invoiceid, consumerTrackingId, `library`, status, responsebody, totalAmount, datetime) VALUES (?, ?, ?, ?, 'SENT', ?, ?, UTC_TIMESTAMP())",
          [invoice.number, invoiceid, trackingId, library, JSON.stringify(response.data), invoice.total_amount]
        );
      }
      await connection.commit();
      return { invoice, request: response.data };
    } catch (error) {
      await connection.rollback();
      return { invoice, error: [{ message: acceptedTrackingId ? `Boundary accepted tracking ID ${acceptedTrackingId}, but the local record could not be updated. Check this request before resubmitting. ${error.message}` : error.message }] };
    } finally {
      try {
        if (locked) await connection.execute('SELECT RELEASE_LOCK(?)', [`invoice-send:${invoiceid}`]);
      } finally { connection.release(); }
    }
  };
}
