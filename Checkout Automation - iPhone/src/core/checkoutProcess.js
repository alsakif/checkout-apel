const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { logStep, randomDelay } = require('../helpers/utilities');
const addToCart = require('../steps/addToCart');
const shipping = require('../steps/shipping');
const billingOptions = require('../steps/billingOptions');

puppeteer.use(StealthPlugin());

async function attemptCheckout(cardData, attemptNumber, maxAttempts) {
  let browser = null;
  try {
    logStep(`Initializing browser session (Attempt ${attemptNumber}/${maxAttempts})`, '🌐');
    browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    //await page.setViewport({ width: 1366, height: 768 });
    
    logStep(`Navigating to product page`, '🧭');
    await page.goto("https://www.apple.com/shop/buy-iphone/iphone-16-pro", {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Clear previous state
    await page.deleteCookie();
    await page.evaluate(() => localStorage.clear());

    // Execute checkout steps
    await addToCart(page);
    await shipping(page);
    const result = await billingOptions(page, cardData);

    logStep('Checkout process completed!', '🎉');
    await browser.close();
    return result;

  } catch (err) {
    logStep(`Attempt ${attemptNumber} failed: ${err.message}`, '💀');
    if (browser) await browser.close();
    throw err; // Re-throw for retry handling
  }
}

async function runWithRetries(cardData, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await attemptCheckout(cardData, attempt, maxRetries);
    } catch (err) {
      if (attempt < maxRetries) {
        logStep(`Retrying (${maxRetries - attempt} attempts remaining)`, '🔄');
        await randomDelay(3000, 5000);
      }
    }
  }
  throw new Error(`All ${maxRetries} checkout attempts failed`);
}

module.exports = { runWithRetries };