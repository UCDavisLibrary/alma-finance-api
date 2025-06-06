const Invoice = require('../models/invoice');
const { setSelectedData } = require("./almaapicalls");
const {reformatAlmaInvoiceforAPI} = require("./formatdata");
const {tokenGenerator} = require("./tokengenerator");
const { logMessage } = require('../util/logger');

exports.aggieEnterprisePaymentRequest = async (invoices) => {

    const paymentRequest = `mutation scmInvoicePaymentRequest($data: ScmInvoicePaymentRequestInput!) {
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
    }}`;
  
    const query = paymentRequest;
    const step1 = await setSelectedData(invoices);
    const variableInputs = await reformatAlmaInvoiceforAPI(step1);
    const token = await tokenGenerator();
  
    try {  
      let results = [];
      if (variableInputs) {
        for (i in variableInputs) {
          variables = variableInputs[i];
          let successfulInputs = [];
          let failedInputs = [];
          await fetch(process.env.BOUNDARY_APP_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              query,
              variables,
            }),
          })
            .then((res) => res.json())
            .then(
              (result) => {
                results.push(result);
              }
            );
        }
        return results;
      }
    }
    catch (error) {
      logMessage('INFO',error);
    }
  
  };
  
  exports.checkPayments = async (variableInputs) => {
  
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
        for (input of variableInputs) {
          variables = input;
          await fetch(process.env.BOUNDARY_APP_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              query,
              variables,
            }),
          })
            .then((res) => res.json())
            .then(
              (result) => {
                const body = {...input, ...result};
                inputstoreturn.push(body);
              }
            );
        }
  
      
      return inputstoreturn;
  
    }
    catch (error) {
      logMessage('INFO',error);
    }
  }
  
  exports.checkStatusInOracle = async (variableInputs) => {
  
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
        inputstoreturn = [];
        for (let variables of variableInputs) {
            await fetch(process.env.BOUNDARY_APP_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                query,
                variables,
              }),
            })
              .then((res) => res.json())
              .then(
                (result) => {
                  inputstoreturn.push(result);
                }
              );
          }
          return inputstoreturn;

        }
      
      catch (error) {
        logMessage('INFO',error);
      }
    }

    exports.checkErpRolesOracle = async () => {
  
      const query = `query erpRoles {
        erpRoles
      }`;
  
        try {
          const token = await tokenGenerator();

              await fetch(process.env.BOUNDARY_APP_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  query,
                }),
              })
                .then((res) => res.json())
                .then(
                  (result) => {

                    logMessage('INFO',JSON.stringify(result.data.erpRoles));
                    // return result;
                  }
                );
            
  
          }
        
        catch (error) {
          logMessage('INFO',error);
        }
      }