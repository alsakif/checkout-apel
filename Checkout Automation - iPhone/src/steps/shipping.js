const { clickSimple, clickComplex } = require('../helpers/browserHelpers');
const { logStep} = require('../helpers/utilities');

async function shipping(page) {
  try {
    logStep('Starting shipping process', '📦');
    
    // ... your shipping implementation

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

    selector = "input[id='checkout.shipping.addressSelector.newAddress.address.firstName']"
    await page.waitForSelector(selector);
    await page.type(selector, "Saqif");
    
    await page.type("input[name='lastName']", 'Abdullah');
    await page.type("input[name='street']", '8284 Baltimore Avenue');

    const input = await page.$("input[name='postalCode']");
    await input.click({ clickCount: 3 });
    await input.type('20740');

    await page.type("input[name='emailAddress']", 'rvbusinessim@gmail.com');
    await page.type("input[name='fullDaytimePhone']", '4437655722');
    
    await clickSimple(page, "button[data-autom='shipping-continue-button']", 
      { visible: true, timeout: 10000 }, 
      'Shipping Continue'
    );


    /*await clickComplex(page, "button[data-autom='use-Existing-address']", 
      { visible: true }, null, 'Select Existing Address', 2
    );*/
    
    logStep('Shipping info submitted', '📮✅');
    return true;
  } catch (err) {
    logStep(`Shipping failed: ${err.message}`, '⚠️');
    throw err;
  }
}

module.exports = shipping;