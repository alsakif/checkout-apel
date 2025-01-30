const { logStep, randomDelay } = require('./utilities');

async function clickSimple(page, selector, options = {}, description = '', maxRetries = 3) {
  // Your existing clickSimple implementation
}

async function clickComplex(page, selector, options = {}, action = null, description = '', maxRetries = 2) {
  // Your existing clickComplex implementation
}

module.exports = { clickSimple, clickComplex };