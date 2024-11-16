const Invoice = require('../models/invoice');

const { setSelectedData } = require("./almaapicalls");

const {reformatAlmaInvoiceforAPI} = require("./formatdata");

const {tokenGenerator} = require("./tokengenerator");

exports.aggieEnterprisePaymentRequest = async (variableInputs) => {
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
    }
  }`;

  const token = await tokenGenerator(); // Ensure token is valid
  const query = paymentRequest;

  if (!variableInputs || variableInputs.length === 0) {
    console.log("No input data provided.");
    return [];
  }

  try {
    const results = [];

    for (const variables of variableInputs) {
      // console.log(JSON.stringify(variables.data.header.consumerTrackingId));

      try {
        const response = await fetch(process.env.BOUNDARY_APP_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();
        results.push(result);
      } catch (error) {
        console.error(`Error with variable input: ${JSON.stringify(variables)} - ${error.message}`);
      }
    }

    return results;
  } catch (error) {
    console.error(`Unexpected error: ${error.message}`);
    return [];
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
      console.log(error);
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
        console.log(error);
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

                    console.log(JSON.stringify(result.data.erpRoles));
                    // return result;
                  }
                );
            
  
          }
        
        catch (error) {
          console.log(error);
        }
      }