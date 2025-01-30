const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    return null;
  }
}

function writeData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function clearData() {
  if (fs.existsSync(dataPath)) {
    fs.unlinkSync(dataPath);
  }
}

module.exports = { readData, writeData, clearData };