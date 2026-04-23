export function checkall(source) {
  const checkboxes = document.querySelectorAll('input[type=checkbox]');
  for (let i = 0, n = checkboxes.length; i < n; i++) {
    checkboxes[i].checked = source.checked;
  }
}

export function recalcFunds(arr) {
  let fundArray = [];
  arr.forEach((fund) => {
    if (fundArray.fund === fund.fund) {
      fundArray.forEach((fundA) => {
        fundA.fundamount.push(fund.amount);
        let total = fundA.fundamount.reduce((a, b) => a + +b, 0);
        fundA.fundamount = [total];
      });
    } else {
      fundArray.push({ fund: fund.fund, fundamount: [fund.amount] });
    }
  });

  return fundArray.map((fund) => {
    return `${fund.fund}: $${fund.fundamount}</br>`;
  }).join('');
}

export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
