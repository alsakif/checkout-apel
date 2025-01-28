const { timeout } = require('puppeteer');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

const url_16 = "https://www.apple.com/shop/buy-iphone/iphone-16-pro";

// Helper function for simple clicks
async function clickSimple(page, selector, options = {}) {
  await page.waitForSelector(selector, options);
  await page.click(selector);
}

// Helper function for complex clicks (evaluate or custom actions)
async function clickComplex(page, selector, options = {}, action = null) {
  await page.waitForSelector(selector, options);
  if (action) {
    await action();
  } else {
    await page.evaluate((s) => document.querySelector(s).click(), selector);
  }
}

async function givePage() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: puppeteer.executablePath()
  });
  return await browser.newPage();
}

async function run() {
  let page = await givePage();
  await page.goto(url_16);
  await addToCart(page);
  await shipping(page);
  await billingOptions(page);
}

async function addToCart(page) {
  await page.waitForNetworkIdle({ idleTime: 500 });
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Screen size
  await clickSimple(page, "input[data-autom='dimensionScreensize6_3inch']", { visible: true, timeout: 3000 });
  
  // Color (uses evaluate click)
  await clickComplex(page, "input[data-autom='dimensionColorblacktitanium']", { visible: true, timeout: 3000 });
  
  // Capacity
  await clickSimple(page, "input[data-autom='dimensionCapacity128gb']", {});
  
  // Trade-in option
  await clickSimple(page, "input[data-autom='choose-noTradeIn']", { visible: true });
  await page.waitForNetworkIdle({ idleTime: 500 });
  
  // Purchase option
  await clickSimple(page, "input[data-autom='purchaseGroupOptionfullprice']", { visible: true });
  await page.waitForNetworkIdle({ idleTime: 500 });
  
  // Carrier
  await clickSimple(page, "input[data-autom='carrierModelUNLOCKED/US']", { visible: true });
  await page.waitForNetworkIdle({ idleTime: 500 });
  
  // AppleCare
  await clickSimple(page, "input[data-autom='applecareplus_58_noapplecare']", { visible: true });
  
  await page.waitForNetworkIdle({ idleTime: 500 });
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Add to cart
  await clickSimple(page, "button[data-autom='add-to-cart']", { visible: true, timeout: 3000 });
}

async function shipping(page) {
  await clickSimple(page, "button[data-autom='proceed']", {});
  await clickSimple(page, "button[data-autom='checkout']", {});
  await clickSimple(page, "button[data-autom='guest-checkout-btn']", {});

  // Radio button selection (custom action)
  await clickComplex(page, "button[role='radio']", {}, async () => {
    await page.evaluate(() => {
      const buttons = document.querySelectorAll('button[role="radio"]');
      if (buttons[0]) buttons[0].click();
    });
  });

  // Zip code
  await page.type("input[id='checkout.fulfillment.deliveryTab.delivery.deliveryLocation.address.postalCode']", '20740');
  await clickSimple(page, "button[data-autom='checkout-zipcode-apply']", {});
  await clickSimple(page, "button[data-autom='fulfillment-continue-button']", {});

  // Address form
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

  // Shipping continue button
  await clickSimple(page, "button[data-autom='shipping-continue-button']", { 
    visible: true,
    timeout: 10000  // Increased timeout
  });

  // Existing address selection
  await clickComplex(page, "button[data-autom='use-Existing-address']")
}

async function billingOptions(page) {
  await clickSimple(page, "input[data-autom='checkout-billingOptions-CREDIT']", {});
  await page.waitForNetworkIdle({ idleTime: 1500 });

  await page.type("input[data-autom='card-number-input']", '5291449275704431');
  await page.type("input[data-autom='expiration-input']", '10/27');
  await page.type("input[data-autom='security-code-input']", '157');

  // First continue button
  await clickSimple(page, "button[data-autom='continue-button-label']", {});
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.waitForNetworkIdle({ idleTime: 1500 });
  
  // Second continue button
  await clickSimple(page, "button[data-autom='continue-button-label']", { visible: true });
  
}

run().catch(err => console.error(err));