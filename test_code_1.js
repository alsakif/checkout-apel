const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const url_16 = "https://www.apple.com/shop/buy-iphone/iphone-16-pro";

// ================== UTILITY FUNCTIONS ==================
function logStep(step, emoji = '⏳') {
  console.log(`[${new Date().toLocaleTimeString()}] [${emoji}] ${step}`);
}

function randomDelay(min, max) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}

// ================== ENHANCED CLICK FUNCTIONS ==================
async function clickSimple(page, selector, options = {}, description = '', maxRetries = 1) {
  let attempt = 1;
  while (attempt <= maxRetries) {
    try {
      logStep(`Attempt ${attempt}/${maxRetries}: ${description}`, '→');
      await page.waitForSelector(selector, { ...options, timeout: options.timeout || 15000 });
      await page.click(selector);
      await randomDelay(500, 1500);
      logStep(`Success: ${description}`, '✅');
      return;
    } catch (err) {
      if (attempt === maxRetries) {
        logStep(`CRITICAL FAILURE: ${description}`, '⚠️');
        await page.screenshot({ path: `error_${Date.now()}_${description.replace(/ /g, '_')}.png` });
        throw new Error(`Failed after ${maxRetries} attempts: ${err.message}`);
      }
      logStep(`Retrying (${err.message.split('\n')[0]})`, '↩️');
      await randomDelay(2000, 5000);
      attempt++;
    }
  }
}

async function clickComplex(page, selector, options = {}, action = null, description = '', maxRetries = 1) {
  let attempt = 1;
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
      return;
    } catch (err) {
      if (attempt === maxRetries) {
        logStep(`COMPLEX FAILURE: ${description}`, '⚠️');
        await page.screenshot({ path: `complex_error_${Date.now()}.png` });
        throw err;
      }
      logStep(`Complex Retry (${err.message.split(':')[0]})`, '↩️');
      await randomDelay(3000, 7000);
      attempt++;
    }
  }
}

// ================== CORE FUNCTIONS ==================
async function addToCart(page) {
  try {
    logStep('Starting cart configuration', '🛒');
    
    await clickSimple(page, "input[data-autom='dimensionScreensize6_3inch']", 
      { visible: true }, 
      'Select screen size',
      2
    );

    await clickComplex(page, "input[data-autom='dimensionColorblacktitanium']", 
      { visible: true }, 
      null,
      'Choose color',
      2
    );

    await clickSimple(page, "input[data-autom='dimensionCapacity128gb']", 
      { visible: true }, 
      '128GB Capacity'
    );

    await clickSimple(page, "input[data-autom='choose-noTradeIn']", 
      { visible: true }, 
      'No Trade-In'
    );

    await clickSimple(page, "input[data-autom='purchaseGroupOptionfullprice']", 
      { visible: true }, 
      'Full Price Option'
    );

    await clickSimple(page, "input[data-autom='carrierModelUNLOCKED/US']", 
      { visible: true }, 
      'Unlocked Carrier'
    );

    await clickSimple(page, "input[data-autom='applecareplus_58_noapplecare']", 
      { visible: true }, 
      'No AppleCare'
    );

    await clickSimple(page, "button[data-autom='add-to-cart']", 
      { visible: true, timeout: 10000 }, 
      'Add to Cart'
    );

    logStep('Cart configuration completed', '✅🛒');
  } catch (err) {
    logStep(`Cart configuration failed: ${err.message}`, '⚠️');
    throw err;
  }
}

async function shipping(page) {
  try {
    logStep('Starting shipping process', '📦');
    
    await clickSimple(page, "button[data-autom='proceed']", 
      { visible: true, timeout: 15000 }, 
      'Cart Proceed Button'
    );

    await clickSimple(page, "button[data-autom='checkout']", 
      { visible: true }, 
      'Checkout Button'
    );

    await clickSimple(page, "button[data-autom='guest-checkout-btn']", 
      { visible: true }, 
      'Guest Checkout'
    );

    await clickComplex(page, "button[role='radio']", 
      { visible: true }, 
      async () => {
        await page.evaluate(() => {
          const buttons = document.querySelectorAll('button[role="radio"]');
          if (buttons[0]) buttons[0].click();
        });
      },
      'Select Shipping Option',
      2
    );

    await page.type("input[id='checkout.fulfillment.deliveryTab.delivery.deliveryLocation.address.postalCode']", '20740');
    await clickSimple(page, "button[data-autom='checkout-zipcode-apply']", {});
    await clickSimple(page, "button[data-autom='fulfillment-continue-button']", {});

    // Address form
    selector = "input[id='checkout.shipping.addressSelector.newAddress.address.firstName']"
    await page.waitForSelector(selector);
    await page.type(selector, "Saqif");
    
    await page.type("input[name='lastName']", 'Abdullah');
    await page.type("input[name='street']", '8284 Baltimore Avenue');

    const input = await page.$("input[name='postalCode']");
    await input.click({ clickCount: 3 });
    await input.type('28748');
    
    await page.type("input[name='emailAddress']", 'rvbusinessim@gmail.com');
    //await page.waitForNetworkIdle({ idleTime: 500 });
    await page.type("input[name='fullDaytimePhone']", '4437655722');
    
    //await page.waitForNetworkIdle({ idleTime: 500 });
    await clickSimple(page, "button[data-autom='shipping-continue-button']", 
      { visible: true, timeout: 10000 }, 
      'Shipping Continue'
    );

    await clickComplex(page, "button[data-autom='use-Existing-address']")

    logStep('Shipping info submitted', '📮✅');
  } catch (err) {
    logStep(`Shipping failed: ${err.message}`, '⚠️');
    throw err;
  }
}

async function billingOptions(page) {
  try {
    logStep('Starting payment process', '💳');
    
    await clickSimple(page, "input[data-autom='checkout-billingOptions-CREDIT']", 
      {}, 
      'Credit Card Option'
    );
    await page.waitForNetworkIdle({ idleTime: 500 });

    await page.type("input[data-autom='card-number-input']", '5406005505783124');
    await page.type("input[data-autom='expiration-input']", '02/26');
    await page.type("input[data-autom='security-code-input']", '577');

    await clickSimple(page, "button[data-autom='continue-button-label']", 
      { visible: true }, 
      'First Continue'
    );

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await page.waitForNetworkIdle({ idleTime: 1500 });

    await clickSimple(page, "button[data-autom='continue-button-label']", 
      { visible: true, timeout: 10000 }, 
      'Final Continue'
    );

   // Wait for navigation completion first
   await page.waitForNavigation({ 
    waitUntil: 'networkidle0', 
    timeout: 20000 
  });

  // Payment status detection
  let paymentFailed = false;
  const errorSelector = '.form-alert.is-error .rt-messages-text';

  try {
    // Check for error message with extended timeout
    await page.waitForSelector(errorSelector, {
      visible: true,
      timeout: 15000
    });
    paymentFailed = true;
  } catch (err) {
    // If no error found, verify success page
    const successIndicator = await page.evaluate(() => {
      return !!document.querySelector('[data-autom="order-confirmation"]');
    });
    
    if (!successIndicator) {
      logStep('Unknown payment status - neither error nor success detected', '⚠️');
      await page.screenshot({ path: `ambiguous_status_${Date.now()}.png` });
    }
  }

  if (paymentFailed) {
    const errorText = await page.evaluate(() => {
      const el = document.querySelector('.rt-messages-text');
      return el ? el.innerText.trim() : 'Payment failed (error message not found)';
    });
    
    // Visual feedback for error
    await page.evaluate((selector) => {
      const errorDiv = document.querySelector(selector);
      if (errorDiv) {
        errorDiv.style.outline = '3px solid #ff0000';
        errorDiv.parentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, errorSelector);

    logStep(`Payment Failed: ${errorText}`, '❌');
  } else {
    logStep('Payment processed successfully!', '✅');
  }

} catch (err) {
  logStep(`Payment processing error: ${err.message}`, '💀');
  await page.screenshot({ path: `payment_failure_${Date.now()}.png` });
  throw err;
}
}

 
// ================== MODIFIED RUN FUNCTION ==================
async function run(retryCount = 0) {
  const MAX_RETRIES = 2;
  let browser = null;

  try {
    logStep(`Initializing browser session (Attempt ${retryCount + 1}/${MAX_RETRIES})`, '🌐');
    browser = await puppeteer.launch({
      headless: false,
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    //await page.setViewport({ width: 1366, height: 768 });
    
    logStep(`Navigating to ${url_16}`, '🧭');
    await page.goto(url_16, { 
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    // Clear cookies to reset state
    await page.deleteCookie();
    
    await addToCart(page);
    await shipping(page);
    await billingOptions(page);
    
    logStep('Checkout process completed!', '🎉');
    await page.waitForNetworkIdle({ idleTime: 1000 });
    await browser.close();
    
  } catch (err) {
    logStep(`Attempt ${retryCount + 1} failed: ${err.message}`, '💀');
    
    if (browser) {
      await browser.close();
      logStep('Closed faulty browser instance', '🔒');
    }

    if (retryCount < MAX_RETRIES) {
      logStep(`Restarting process (${MAX_RETRIES - retryCount} attempts remaining)`, '🔄');
      await randomDelay(3000, 5000); // Cool-down period
      return run(retryCount + 1); // Recursive retry
    }
    
    logStep('Maximum retries exceeded', '💥');
    process.exit(1);
  }
}

// Start the process with initial attempt
run(0).catch(err => console.error(err));
