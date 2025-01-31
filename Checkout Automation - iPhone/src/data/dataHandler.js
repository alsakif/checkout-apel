const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../../payment-data.json');

function savePaymentData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function loadPaymentData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function clearPaymentData() {
  if (fs.existsSync(dataPath)) fs.unlinkSync(dataPath);
}

module.exports = { savePaymentData, loadPaymentData, clearPaymentData };