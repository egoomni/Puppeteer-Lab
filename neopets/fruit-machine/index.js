require('dotenv').load();
const puppeteer = require('puppeteer');
const {neopets_login} = require('../login/index.js');

const whereto = "http://www.neopets.com/desert/fruit/index.phtml";

(async () => {

  console.log("Launching Headless Chrome");
  const browser = await neopets_login(
    process.env.NEOPETS_USERNAME,
    process.env.NEOPETS_PASSWORD
  );

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  console.log("Spun the fruit machine");
  await page.click("input[type='submit'][value='Spin, spin, spin!']");
  
  console.log("SUCCESS");

  console.log("Closing Headless Chrome");
  await browser.close();

})();
