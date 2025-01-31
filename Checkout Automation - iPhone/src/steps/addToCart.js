const { timeout } = require('puppeteer');
const { clickSimple, clickComplex } = require('../helpers/browserHelpers');
const { logStep } = require('../helpers/utilities');

async function addToCart(page) {
  try {
    logStep('Starting cart configuration', '🛒');
    
    await clickSimple(page, "input[data-autom='dimensionScreensize6_3inch']", 
      { visible: true }, 'Select screen size', 2);

    await clickComplex(page, "input[data-autom='dimensionColorblacktitanium']",
      { visible: true }, null, 'Select color', 2);

    await clickSimple(page, "input[data-autom='dimensionCapacity128gb']",
      { visible: true }, 'Select storage', 2);
    

    await clickSimple(page, "input[data-autom='choose-noTradeIn']",
      { visible: true }, 'No Trade-In', 2);

  

    await clickSimple(page, "input[data-autom='purchaseGroupOptionfullprice']", 
        { visible: true }, 'Full Price Option', 2);

    
    
    await clickSimple(page, "input[data-autom='carrierModelUNLOCKED/US']", 
          { visible: true },'Unlocked Carrier', 2);


    await clickSimple(page, "input[data-autom='applecareplus_58_noapplecare']", 
            { visible: true },'No AppleCare', 2);

      
    await clickSimple(page, "button[data-autom='add-to-cart']",
          { visible: true, timeout: 15000 }, 'Add to Cart', 2);

    await Promise.all([
      page.waitForNavigation({ 
        waitUntil: ['networkidle0', 'domcontentloaded'], 
        timeout: 30000 
      }),
      page.waitForSelector("button[data-autom='proceed']", {
        visible: true,
        timeout: 30000
      })
    ]);

    await clickComplex(
      page,
      "button[data-autom='proceed']",
      {
        visible: true,
        enabled: true,
        timeout: 25000,
        extraChecks: async () => {
          await page.waitForNetworkIdle({ idleTime: 500 });
          await randomDelay(1000, 2000);
        }
      },
      async () => {
        await page.evaluate(() => {
          const btn = document.querySelector("button[data-autom='proceed']");
          btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          btn.click();
        });
      },
      'Cart Proceed Button',
      3
    );

    logStep('Cart configuration completed', '✅🛒');
    return true;
  } catch (err) {
    logStep(`Cart configuration failed: ${err.message}`, '⚠️');
    throw err;
  }
}

module.exports = addToCart;