import { randomUUID } from 'node:crypto';
import db from '../util/database.js';
import { setSelectedData } from './almaapicalls.js';
import { reformatAlmaInvoiceforAPI } from './formatdata.js';
import { aggieEnterprisePaymentRequest } from './graphqlcalls.js';

import { createSubmitInvoice } from './submission-flow.js';

export const submitInvoice = createSubmitInvoice({ db, setSelectedData, reformatAlmaInvoiceforAPI, aggieEnterprisePaymentRequest, randomUUID });
