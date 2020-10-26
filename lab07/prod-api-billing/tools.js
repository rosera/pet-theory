// JSON Test Library
// Author: Rich Rose
// Description: Utility to process test JSON data

const bills=require('./data/billing');

//--------- Tools - handle information in the json file(s)

//--------------- bills
const listBilling = () => {
  let listRecords = {};
  try {
    listRecords = bills.billing.filter((bill) => {
      console.log('month: ' + bill.month)
      return `{month: bill.month}`
    });
  } catch (error)
  {
    console.log(`listBilling error: ${error}`);
  }

  return listRecords;
}


const findBill = (ref) => {
  let  findBill = {};
  try {
    findBill = bills.billing.find((bill) => bill.ref === ref);
    console.log(`Month: ${findBill.ref}`);
  } catch (exception) {
    findBill={
      "month": ""
    }
    findBill.invoices = [];
    console.log('Bill not found');
  }
  return findBill;
}

// Library exports
module.exports = {
 listBilling: listBilling,
 findBill: findBill
}
