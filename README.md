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