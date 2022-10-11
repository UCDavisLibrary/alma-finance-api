# alma-finance-api

Uses fetch API to GET outstanding invoices from alma and POST them to aggie enterprise for payment

### Technologies Used

### Dependencies

https://github.com/mjwdavis/alma-cors-proxy

### Usage

1. Download and run https://github.com/mjwdavis/alma-cors-proxy
1. Install dependencies: `npm install`
1. Add an `.env` file in the root directory with the following variables:
   - `PORT=PORT_YOU_WANT_TO_RUN_APP_ON`
   - `ALMA_URL`
   - `ALMA_KEY`
   - `AUTH_TOKEN`
1. Run server: `npm start`
1. Run server (development): `nodemon`
1. Build header: `npm run watch`
