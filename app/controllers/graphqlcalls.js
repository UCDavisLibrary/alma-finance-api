import { logMessage } from '../util/logger.js';
import { tokenGenerator } from './tokengenerator.js';
import config from '../util/config.js';

export async function aggieEnterprisePaymentRequest(variableInputs) {
  const query = `mutation scmInvoicePaymentRequest($data: ScmInvoicePaymentRequestInput!) {
    scmInvoicePaymentCreate(data: $data) {
      requestStatus {
        requestId
        consumerId
        requestDateTime
        requestStatus
        operationName
      }
      validationResults {
        errorMessages
        messageProperties
      }
    }
  }`;

  if (!variableInputs || variableInputs.length === 0) {
    logMessage('DEBUG', 'No input data provided.');
    return [];
  }

  try {
    const token = await tokenGenerator();
    const results = [];

    for (const variables of variableInputs) {
      try {
        const response = await fetch(config.aggie.boundaryAppUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query, variables }),
        });
        if (!response.ok) {
          const body = await response.text();
          const message = `HTTP Error: ${response.status}${body ? ` ${body}` : ''}`;
          logMessage('DEBUG', `graphqlcalls: aggieEnterprisePaymentRequest(). ${message}`);
          results.push({
            errors: [{ message }],
            httpStatus: response.status,
            responseBody: body,
          });
          continue;
        }
        results.push(await response.json());
      } catch (error) {
        logMessage('DEBUG', `graphqlcalls: aggieEnterprisePaymentRequest(). Error: ${error.message}`);
        results.push({ errors: [{ message: error.message }] });
      }
    }

    return results;
  } catch (error) {
    logMessage('DEBUG', `graphqlcalls: aggieEnterprisePaymentRequest(). Unexpected error: ${error.message}`);
    return [];
  }
}

export async function checkPayments(variableInputs) {
  const query = `query scmInvoicePaymentRequestStatusByConsumerTracking($consumerTrackingId: String!) {
    scmInvoicePaymentRequestStatusByConsumerTracking(consumerTrackingId: $consumerTrackingId) {
      requestStatus {
        requestId
        consumerNotes
        operationName
        requestDateTime
        requestStatus
        lastStatusDateTime
        processedDateTime
        errorMessages
        batchRequest
      }
      processingResult {
        status
        requestDateTime
        lastStatusCheckDateTime
        processedDateTime
        errorMessages
        hasWarnings
        jobs {
          jobId
          jobStatus
          assignedJobId
          jobReport
          completedDateTime
          failedRecords
        }
      }
      validationResults {
        valid
        errorMessages
        messageProperties
      }
    }
  }`;

  try {
    const token = await tokenGenerator();
    const inputstoreturn = [];
    for (const variables of variableInputs) {
      const result = await fetch(config.aggie.boundaryAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      }).then((res) => res.json());
      inputstoreturn.push({ ...variables, ...result });
    }
    return inputstoreturn;
  } catch (error) {
    logMessage('DEBUG', 'graphqlcalls: checkPayments()', error);
  }
}

export async function checkStatusInOracle(variableInputs) {
  const query = `query scmInvoicePaymentSearch($filter: ScmInvoicePaymentFilterInput!) {
    scmInvoicePaymentSearch(filter: $filter) {
      metadata {
        sort
        limit
        returnedResultCount
        startIndex
        nextStartIndex
        totalResultCount
      }
      data {
        invoiceId
        vendorId
        vendorSiteId
        orgId
        poHeaderId
        supplierNumber
        supplierSiteCode
        supplierName
        supplierInvoiceNumber
        invoiceNumber
        poNumber
        checkNumber
        paymentAmount
        invoiceDate
        paymentDate
        paymentStatusCode
        paymentSourceName
        checkStatusCode
        paymentMethodCode
        batchName
        lastUpdateDateTime
        lastUpdateUserId
      }
    }
  }`;

  try {
    const token = await tokenGenerator();
    const inputstoreturn = [];
    for (const variables of variableInputs) {
      const result = await fetch(config.aggie.boundaryAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query, variables }),
      }).then((res) => res.json());
      inputstoreturn.push(result);
    }
    return inputstoreturn;
  } catch (error) {
    logMessage('DEBUG', 'graphqlcalls: checkStatusInOracle()', error);
  }
}

export async function checkErpRolesOracle() {
  const query = `query erpRoles {
    erpRoles
  }`;

  try {
    const token = await tokenGenerator();
    const result = await fetch(config.aggie.boundaryAppUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    }).then((res) => res.json());
    logMessage('INFO', 'graphqlcalls: checkErpRolesOracle()', JSON.stringify(result.data.erpRoles));
  } catch (error) {
    logMessage('DEBUG', 'graphqlcalls: checkErpRolesOracle()', error);
  }
}
