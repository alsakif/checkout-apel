const inquirer = require('inquirer');

async function getCreditCardInfo() {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'cardNumber',
      message: 'Enter credit card number:',
      validate: input => /^\d{16}$/.test(input) || 'Must be 16 digits'
    },
    {
      type: 'input',
      name: 'expiry',
      message: 'Expiration date (MM/YY):',
      validate: input => /^\d{2}\/\d{2}$/.test(input) || 'Use MM/YY format'
    },
    {
      type: 'password',
      name: 'cvv',
      message: 'CVV:',
      validate: input => /^\d{3,4}$/.test(input) || 'Must be 3-4 digits'
    }
  ]);
}

async function getMainChoice() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Found existing data:',
      choices: [
        { name: 'Continue with stored data', value: 'continue' },
        { name: 'Enter new data', value: 'new' }
      ]
    }
  ]);
}

async function getDeletionChoice() {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'shouldDelete',
      message: 'Delete stored payment data?',
      default: true
    }
  ]);
}

module.exports = { getCreditCardInfo, getMainChoice, getDeletionChoice };