This is an app for the handling of invoice payments between the alma and the aggie enterprise system. 

It consists of:

1. A cors proxy for sending data to and from alma.
2. A javascipt application
3. A database
4. Adminer (optional)

NOTES:

When first building the database, run the following SQL command
CREATE TABLE invoices (
    id bigint,
    requestbody text
);
### Invoice processing failures

The `finance-file-loader` nightly scan (6:30 PM America/Los_Angeles) checks
Oracle payments first, then Boundary submission status by tracking ID. Explicit request, processing, or job `ERROR` statuses move invoices to
**Needs Attention**. HTTP failures, missing results, and GraphQL errors do not
change the invoice category. Pending notifications are retried on subsequent
scans, independently of whether the status lookup succeeds that day.

Failure emails go to the invoice library's email addresses in `users`. Set
`APP_URL` in **file-loader/app.env** to the externally reachable app URL, and
configure its existing SMTP settings. Missing recipients/APP_URL or SMTP errors
are logged and leave the notification pending. A successful SMTP submission is
recorded to suppress repeat daily alerts; an interruption between SMTP acceptance
and saving that record can cause a duplicate email on the next scan.

**Deploy the schema before the updated app or file-loader.** Back up the database,
then run `migrations/20261104-invoice-attention.sql` once against the application
database. Existing volumes need this explicit migration; restarting MySQL does
not run initialization scripts. Both Compose files mount this migration after
the SQL dump for newly initialized volumes. Rebuild/recreate `alma-finance` and
`finance-file-loader` after deploying the changes. The local Compose stack does
not run `finance-file-loader`, so it will not populate Needs Attention by itself.

The Needs Attention page allows manual resubmission after source data is corrected.
It fetches fresh Alma invoice, vendor, and fund data, uses a new tracking ID, and
returns the existing invoice record to `SENT` only after Boundary accepts it.
Submission history retains previous tracking IDs and processing failures. A
transport error can leave acceptance uncertain: check the recorded tracking ID
before trying again. No automatic resubmission occurs.

Run focused checks from the repository root:

```sh
node --test tests/*.test.cjs tests/*.test.mjs
```

After login, the app checks Boundary processing status for unpaid submissions in
its active library. Confirmed failures are saved to Needs Attention, then a modal
links the user to that queue when it contains invoices. This check runs once per
login session per library (including an administrator's library switch), without
blocking the rest of the app. An unavailable status service does not classify an
invoice as failed; existing Needs Attention records can still trigger the notice.
The login check does not send email; the nightly job handles pending notifications.


Invoice submission reuses valid cached supplier and accounting data. An incomplete
vendor record (including `{}` or malformed JSON) or invalid fund mapping triggers
one Alma repair lookup per unique reference in the formatting operation. Successful
repairs are saved and marked OK before submission continues. Required supplier
fields or incomplete accounting segments block submission if they cannot be
repaired; invalid fund distributions are never silently omitted. Vendor and fund
lookups have 15-second timeouts. Preview continues using its existing cached data
path rather than refreshing all reference data on every load.


### Production browser assets

The app Dockerfile compiles JavaScript and CSS with `npm run client-build`, then
starts the server. Production serves those compiled files directly from the image.
There is no separate production client service or source-code mount hiding the
built files. Gmail's `IS_LOCAL` setting does not control client assets.

Deploy updated source (after any required database migration) with:

```sh
docker compose up --build -d
```

The local Compose file retains source mounts, the development server, and the
client watcher for live editing.
