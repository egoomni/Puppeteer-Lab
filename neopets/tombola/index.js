require('dotenv').load();
const puppeteer = require('puppeteer');
const {neopets_login} = require('../login/index.js');

const whereto = "http://www.neopets.com/island/tombola.phtml";

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

  console.log("Playing Tombola");
  await page.click("input[type='submit'][value='Play Tombola!']");

  const date = new Date().toISOString().split("T")[0];
  const save_path = `dump/${date}_tombola_results.png`;
  console.log(`Saving tombola results as ${save_path}`);
  await page.screenshot({path: save_path});
  console.log("SUCCESS");

  console.log("Closing Headless Chrome");
  await browser.close();

})();
