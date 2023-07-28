const Invoice = require('../models/invoice');

const { setSelectedData, simpleInvoice } = require("./apicalls");

const {reformatAlmaInvoiceforAPI} = require("./formatdata");

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
  
    try {
      const step1 = await setSelectedData(invoices);
      const variableInputs = await reformatAlmaInvoiceforAPI(step1);
  
      let results = [];
      if (variableInputs) {
        for (i in variableInputs) {
          variables = variableInputs[i];
          let successfulInputs = [];
          let failedInputs = [];
          await fetch(process.env.SIT_2_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
              query,
              variables,
            }),
          })
            .then((res) => res.json())
            .then(
              (result) => {
                console.log(JSON.stringify(result)); // display errors on tool
                results.push(result);
              }
                // result.data.scmInvoicePaymentCreate.validationResults.errorMessages[0].startsWith(
                //   'A request already exists for your consumerId and consumerTrackingId'
                // ) ||
                // result.data.scmInvoicePaymentCreate.validationResults.errorMessages ==
                //   null
                //   ? console.log('perfect') // change invoice status
                //   : console.log(JSON.stringify(result)) // display errors on tool
            );
        }
        return results;
      }
    }
    catch (error) {
      console.log(error);
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
      }
      validationResults {
        valid
        errorMessages
        messageProperties
      }
    }
  }`;
  
  
    try {
      // const variableInputs = await simpleInvoice();
      console.log(JSON.stringify(variableInputs));
      const inputstoreturn = [];
      console.log(variableInputs);
        for (input of variableInputs) {
          variables = input;
          // console.log(variables);
          await fetch(process.env.SIT_2_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
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
  
  exports.checkStatusInOracle = async () => {
  
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
    
    const variables = 
    { "filter":   
    {
      "invoiceNumber": {"contains": "Wolters_AE11076"},
    } 
    };
  
    // {
    //   "searchCommon": SearchCommonInputs,
    //   "invoiceNumber": StringFilterInput,
    //   "supplierNumber": StringFilterInput,
    //   "invoiceDate": DateFilterInput
    // }
    
      try {
  
  
  
            // console.log(variables);
            await fetch(process.env.SIT_2_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
              },
              body: JSON.stringify({
                query,
                variables,
              }),
            })
              .then((res) => res.json())
              .then(
                (result) => {
                  console.log(JSON.stringify(result));
                }
              );
          }
  
    
      
      catch (error) {
        console.log(error);
      }
    }