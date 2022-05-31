# alma-finance-api

Uses fetch API to GET outstanding invoices from alma and POST them to aggie enterprise for payment

### Technologies Used

### Usage

1. Install dependencies: `npm install`
2. Add an `.env` file in the root directory with the following variables:
   - `PORT=PORT_YOU_WANT_TO_RUN_APP_ON`
   - `ALMA_URL`
   - `ALMA_KEY`
   - `AUTH_TOKEN`
3. Run server: `npm start`
4. Run server (development): `nodemon`
5. Build header: `npm run watch`
