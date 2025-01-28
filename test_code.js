const { timeout } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const url_16 = "https://www.apple.com/shop/buy-iphone/iphone-16-pro";

async function givePage() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath() // Use Puppeteer's built-in executable
  });
  let page = await browser.newPage();
  return page;
}

async function run() {
  let page = await givePage();
  await page.goto(url_16);
  await addToCart(page);
  await shipping(page);
  await billingOptions(page);
}


async function addToCart(page) {

  await page.waitForNetworkIdle({ idleTime: 500 }); // settle the network
  await new Promise(resolve => setTimeout(resolve, 2000));// wait for 3 seconds

  selector = "input[data-autom='dimensionScreensize6_3inch']"
  await page.waitForSelector(selector, { visible: true, timeout: 3000 });
  await page.click(selector);

  selector = "input[data-autom='dimensionColorblacktitanium']"
  await page.waitForSelector(selector, { visible: true, timeout: 3000 });
  await page.evaluate((s) => document.querySelector(s).click(), selector);

  selector = "input[data-autom='dimensionCapacity128gb']"
  await page.waitForSelector(selector);
  await page.click(selector);

  selector = "input[data-autom='choose-noTradeIn']"
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
  await page.waitForNetworkIdle({ idleTime: 500 });

  selector = "input[data-autom='purchaseGroupOptionfullprice']";
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
  await page.waitForNetworkIdle({ idleTime: 500 });

  selector = "input[data-autom='carrierModelUNLOCKED/US']"
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);
  await page.waitForNetworkIdle({ idleTime: 500 });

  selector = "input[data-autom='applecareplus_58_noapplecare']";
  await page.waitForSelector(selector, { visible: true });
  await page.click(selector);

  await page.waitForNetworkIdle({ idleTime: 500 }); // check if the network is setteled for 0.5 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));// wait for 1 seconds


  selector = "button[data-autom='add-to-cart']";
  await page.waitForSelector(selector, { visible: true, timeout: 3000 });
  await page.click(selector);
}

async function shipping(page) {
  
  selector = "button[data-autom='proceed']"
  await page.waitForSelector(selector);
  await page.click(selector);

  selector = "button[data-autom='checkout']"
  await page.waitForSelector(selector);
  await page.click(selector);

  selector = "button[data-autom='guest-checkout-btn']"
  await page.waitForSelector(selector);
  await page.click(selector);

  selector = "button[role='radio']"
  await page.waitForSelector(selector);
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button[role="radio"]');
    if (buttons[0]) buttons[0].click();
  });

  selector = "input[id='checkout.fulfillment.deliveryTab.delivery.deliveryLocation.address.postalCode']"
  await page.waitForSelector(selector);
  await page.type(selector,'20740')

  selector = "button[data-autom='checkout-zipcode-apply']"
  await page.waitForSelector(selector);
  await page.click(selector);

  selector = "button[data-autom='fulfillment-continue-button']"
  await page.waitForSelector(selector);
  await page.click(selector);

  
  
  selector = "input[id='checkout.shipping.addressSelector.newAddress.address.firstName']"
  await page.waitForSelector(selector);
  await page.type(selector, "Saqif");
  
  await page.type("input[name='lastName']", 'Abdullah');
  await page.type("input[name='street']", '8284 Baltimore Avenue');
  
  // Zip code handling
  const input = await page.$("input[name='postalCode']");
  await input.click({ clickCount: 3 });
  await input.type('28748');
  
  await page.type("input[name='emailAddress']", 'rvbusinessim@gmail.com');
  await page.waitForNetworkIdle({ idleTime: 500 });
  await page.type("input[name='fullDaytimePhone']", '4437655722');
  await page.waitForNetworkIdle({ idleTime: 500 });

  selector = "button[data-autom='shipping-continue-button']";
  await page.click(selector);
  await page.waitForNetworkIdle({ idleTime: 1500 });

  selector = "button[data-autom='use-Existing-address']";
  await page.evaluate((s) => document.querySelector(s).click(), selector);
}


async function billingOptions(page) {
  selector = "input[data-autom='checkout-billingOptions-CREDIT']"
  await page.waitForSelector(selector);
  await page.click(selector);
  await page.waitForNetworkIdle({ idleTime: 1500 });

  selector = "input[data-autom='card-number-input']"
  await page.waitForSelector(selector);
  await page.type (selector, '5440401009535383');

  selector = "input[data-autom='expiration-input']"
  await page.waitForSelector(selector);
  await page.type (selector, '05/25');

  selector = "input[data-autom='security-code-input']"
  await page.waitForSelector(selector);
  await page.type (selector, '826');

  // Click the first continue button
  const firstButtonSelector = "button[data-autom='continue-button-label']";
  await page.waitForSelector(firstButtonSelector);
  await page.click(firstButtonSelector);
  
  // Wait for navigation to complete
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  // Wait for the second button to be visible and clickable
  const secondButtonSelector = "button[data-autom='continue-button-label']";
  await page.waitForSelector(secondButtonSelector, { visible: true });
  
  await page.waitForNetworkIdle({ idleTime: 1500 });
  await page.click(secondButtonSelector);
  
}


run().catch(err => console.error(err));