const csv = require('csv-parser');
const fs  = require('fs');

const arr = [];
let bitcoinTotal  = 0;
let totalFees     = 0;
let totalSpent    = 0;

fs.createReadStream('./coinbasecsv.csv')
  .pipe(csv(['Timestamp','Type','BTC','Subtotal','Fees','Total','Currency','Price Per Coin','Payment Method','ID','Share']))
  .on('headers', header => {

  }).on('data', (data) => {

    let pricePerCoin  = parseFloat(data['Price Per Coin']);
    let amtPurchased  = parseFloat(data['BTC']);
    let fee           = parseFloat(data['Fees']);
    let total         = parseFloat(data['Total']);
    let isABuy        = data['Type'] === 'Buy';

    if( typeof total === 'number' && !isNaN(total)
        && (typeof amtPurchased === 'number' && !isNaN(amtPurchased))
        && isABuy ) {
      arr.push((pricePerCoin * amtPurchased) + fee);
      bitcoinTotal += amtPurchased;
      totalFees += fee;
      totalSpent += total;
    }

  }).on('end', () => {
    const sum = arr.reduce((prev, current) => {
      return prev + current;
    }, 0);
    console.log(`Total Buy Events: ${arr.length}`);
    console.log(`Total Bitcoins Purchased: ${bitcoinTotal}`);
    console.log(`Weighted Average Price: $${(sum / bitcoinTotal).toFixed(2)}`);
    console.log(`Total Fees: $${totalFees.toFixed(2)}`);
    console.log(`Total Cash Spent: $${totalSpent.toFixed(2)}`);

  });
