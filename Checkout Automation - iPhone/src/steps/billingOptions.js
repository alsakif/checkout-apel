const { clickSimple } = require('../helpers/browserHelpers');
const { logStep } = require('../helpers/utilities');

async function billingOptions(page, cardData) {
  try {
    logStep('Starting payment process', '💳');
    
    await clickSimple(page, "input[data-autom='checkout-billingOptions-CREDIT']", 
      {}, 'Credit Card Option');
      
    await page.waitForNetworkIdle({ idleTime: 500 });

    await page.type("input[data-autom='card-number-input']", cardData.cardNumber);
    await page.type("input[data-autom='expiration-input']", cardData.expiry);
    await page.type("input[data-autom='security-code-input']", cardData.cvv);

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
        //await page.screenshot({ path: `ambiguous_status_${Date.now()}.png` });
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
    await new Promise(resolve => setTimeout(resolve, 3000));
  } else {
    logStep('Payment processed successfully!', '✅');
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
    
    
    return true;
  } catch (err) {
    logStep(`Payment processing error: ${err.message}`, '💀');
    //await page.screenshot({ path: `payment_failure_${Date.now()}.png` });
    throw err;
  }
}

module.exports = billingOptions;