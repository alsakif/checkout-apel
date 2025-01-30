const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { logStep } = require('../helpers/utilities');
const addToCart = require('../steps/addToCart');
const shipping = require('../steps/shipping');
const billingOptions = require('../steps/billingOptions');

puppeteer.use(StealthPlugin());

async function processPaymentAttempt(card) {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath(),
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    
    logStep('Starting checkout process', '🚀');
    await page.goto('https://www.apple.com/shop/buy-iphone/iphone-16-pro');
    
    await addToCart(page);
    await shipping(page);
    const result = await billingOptions(page, card);
    
    return result;
  } finally {
    await browser.close();
  }
}

module.exports = { processPaymentAttempt };