const { logStep, randomDelay } = require('./utilities');

async function clickSimple(page, selector, options = {}, description = '', maxRetries = 1) {
  let attempt = 1;
  while (attempt <= maxRetries) {
    try {
      logStep(`Attempt ${attempt}/${maxRetries}: ${description}`, '→');
      await page.waitForSelector(selector, { ...options, timeout: options.timeout || 15000 });
      await page.click(selector);
      await randomDelay(500, 1500);
      logStep(`Success: ${description}`, '✅');
      return true;
    } catch (err) {
      if (attempt === maxRetries) {
        logStep(`CRITICAL FAILURE: ${description}`, '⚠️');
        throw new Error(`Failed after ${maxRetries} attempts: ${err.message}`);
      }
      logStep(`Retrying (${err.message.split('\n')[0]})`, '↩️');
      await randomDelay(2000, 5000);
      attempt++;
    }
  }
  return false;
}

async function clickComplex(page, selector, options = {}, action = null, description = '', maxRetries = 1) {

  let attempt = 2;
  while (attempt <= maxRetries) {
    try {
      logStep(`Complex Attempt ${attempt}/${maxRetries}: ${description}`, '↻');
      await page.waitForSelector(selector, { ...options, timeout: options.timeout || 20000 });
      
      if (action) {
        await action();
      } else {
        await page.evaluate((s) => {
          const el = document.querySelector(s);
          if (el) el.click();
          else throw new Error('Element not found');
        }, selector);
      }

      await randomDelay(1000, 2500);
      logStep(`Complex Success: ${description}`, '✅');
      return true;
    } catch (err) {
      if (attempt === maxRetries) {
        logStep(`COMPLEX FAILURE: ${description}`, '⚠️');
        throw err;
      }
      logStep(`Complex Retry (${err.message.split(':')[0]})`, '↩️');
      await randomDelay(3000, 7000);
      attempt++;
    }
  }
  return false;
}

module.exports = { clickSimple, clickComplex };