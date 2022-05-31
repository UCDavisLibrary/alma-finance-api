async function getData() {
  document.getElementById('getData').style.display = 'none';
  // note - alma cors error - test data only
  const response = await fetch(
    'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=margarita%'
  );
  console.log(response);
  const data = await response.json();
  console.log(data);
  length = data.drinks.length;
  console.log(data);
  var temp = '';
  temp += '<table>';
  for (i = 0; i < length; i++) {
    temp += '<tr>';
    temp += '<td>' + data.drinks[i].strDrink + '</td>';
    temp += '<td>' + data.drinks[i].strInstructions + '</td>';
  }
  temp += '<table>';

  document.getElementById('databox').innerHTML = temp;
}

const variables = {
  // from test app

  data: {
    header: {
      boundaryApplicationName: 'TESTING_APP',
      consumerId: 'CONSUMER_ID',
      consumerReferenceId: 'A_UNIQUE_ID',
      consumerTrackingId: 'CONSUMER_ORDER_NBR',
    },
    payload: {
      invoiceNumber: 'AND_Unmatched_Invoice',
      businessUnit: 'SCM',
      invoiceDate: '2022-01-01',
      supplierNumber: '10002',
      supplierSiteCode: 'AUSTRALIA',
      invoiceDescription: 'Office Supply',
      invoiceType: 'STANDARD',
      purchaseOrderNumber: '123',
      invoiceAmount: 5.25,
      invoiceLines: [
        {
          itemName: 'ITEM_X',
          itemDescription: 'Something meaningful',
          lineAmount: 5.25,
          lineType: 'ITEM',
          unitOfMeasureCode: 'AC',
          purchaseOrderLineNumber: 1,
          quantity: 1,
          unitPrice: 5.25,
          ppmSegments: {
            project: 'GP12345678',
            task: '123456',
            organization: '9300479',
            expenditureType: '12345E - Lab Equipment',
          },
        },
      ],
    },
  },
};

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
}}`;

const sendData = () => {
  fetch('https://graphql-data-server-erp-poc.aws.ait.ucdavis.edu/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      APIAuthToken: AUTH_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((res) => res.json())
    .then((result) => console.log(result));
};
