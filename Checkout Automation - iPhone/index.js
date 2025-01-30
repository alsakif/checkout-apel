const { readData, writeData, clearData } = require('./dataHandler');
const { getCreditCardInfo, getMainChoice, getDeletionChoice } = require('./prompts');
const { run } = require('./checkoutFlow');

async function main() {
  let paymentData = readData();
  
  if (paymentData) {
    const { action } = await getMainChoice();
    if (action === 'new') {
      paymentData = await getCreditCardInfo();
      writeData(paymentData);
    }
  } else {
    paymentData = await getCreditCardInfo();
    writeData(paymentData);
  }

  try {
    await run(paymentData);
    
    const { shouldDelete } = await getDeletionChoice();
    if (shouldDelete) {
      clearData();
      console.log('🗑  Payment data cleared successfully');
    }
  } catch (error) {
    console.error('❌ Checkout failed:', error.message);
    process.exit(1);
  }
}

main();