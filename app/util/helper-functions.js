exports.checkall = (source) => {
    checkboxes = document.querySelectorAll('input[type=checkbox]')
    for(var i=0, n=checkboxes.length;i<n;i++) {
      checkboxes[i].checked = source.checked;
    }
  }

  exports.recalcFunds = (arr) => {
    let fundArray = [];
  
     arr.forEach((fund) => {
       if (fundArray.fund === fund.fund) {
         fundArray.forEach((fundA) => {
             fundA.fundamount.push(fund.amount);
             let total = fundA.fundamount.reduce((a, b) => a + +b, 0);
             fundA.fundamount = [total];
         });
       }
       else {
         fundArray.push({fund: fund.fund,
           fundamount: [fund.amount]});
       }
     })

     console.log(JSON.stringify('fundArray is: ' + JSON.stringify(fundArray)));
   
     return fundArray.map((fund) => {
       console.log(JSON.stringify('fund is: ' + JSON.stringify(fund)));
       return `${fund.fund}: $${fund.fundamount}</br>`;
     }).join('');
   
   
     }