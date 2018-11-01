// https://developers.google.com/web/tools/puppeteer/get-started
const rl = require('readline-sync');
const puppeteer = require('puppeteer');
const {neopets_login} = require('../login/index.js');

const whereto = "http://www.neopets.com/lab2.phtml";

(async () => {

  console.log("Launching Headless Chrome");
  const browser = await neopets_login(process.env.USERNAME, process.env.PASSWORD);

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  const neopets = await page.$$eval("input[type='radio']", radio_inputs => {
    const all_neopets = [...radio_inputs].map(el => el.value);
    return [...new Set(all_neopets)];
  });

  const neopet_index = rl.keyInSelect(neopets, "Which Neopet?");
  const gimmeNeopet = neopets[neopet_index];

  await page.evaluate((neopet) => document.querySelector(`input[type='radio'][value='${neopet}']`).checked = true, gimmeNeopet);

  await page.click(`input[type='radio'][value='${neopets[neopet_index]}']`);
  await page.click("input[type='submit'][value='Carry on with the Experiment!']");

  console.log(`Submitting ${gimmeNeopet} for lab treatment`);

  await page.waitForNavigation({waitUntil: "load"});

  const date = new Date().toISOString().split("T")[0];
  const save_path = `${date}_lab_results.png`;
  console.log(`Saving lab results to ${save_path}`);
  await page.screenshot({path: save_path});

  console.log("Closing Headless Chrome")
  await browser.close();

})();
