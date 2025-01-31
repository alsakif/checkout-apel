const { loadPaymentData, savePaymentData, clearPaymentData } = require('./src/data/dataHandler');
const { getPaymentData } = require('./src/cli/prompts');
const { runWithRetries } = require('./src/core/checkoutProcess');
const inquirer = require('inquirer');


async function main() {
  try {
    let paymentData = loadPaymentData();
    
    if (!paymentData) {
      paymentData = await getPaymentData();
      savePaymentData(paymentData);
    }

    await runWithRetries(paymentData);

    const { confirmClear } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmClear',
      message: 'Clear stored payment data?',
      default: true
    });

    if (confirmClear) clearPaymentData();

  } catch (error) {
    console.error('❌ Final checkout failure:', error.message);
    process.exit(1);
  }
}

main();