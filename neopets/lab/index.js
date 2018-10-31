// https://developers.google.com/web/tools/puppeteer/get-started
const rl = require('readline-sync');
const slp = require('sleep-async')().Promise
const puppeteer = require('puppeteer');

const whereto = "http://www.neopets.com/lab2.phtml";

(async () => {

  console.log("Launching Headless Chrome");
  const browser = await puppeteer.launch();

  console.log("Browser initializing new page");
  const page = await browser.newPage();

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);
  console.log("Arrived at destination");

  // await slp.sleep(10 * 1000);

  const divs = await page.$$eval("form", form => form[1]);
  console.log(divs);

  // const neopets = await page.$$eval("input[type='radio']", radio_inputs => {
  //   const all_neopets = [...radio_inputs].map(el => el.value);
  //   return [...new Set(all_neopets)];
  // });
  //
  // console.log(neopets);
  // const neopet_index = rl.keyInSelect(neopets, "Which Neopet?");

  // `input[type='radio'][value='${neopets[neopets_index]}']`

  console.log("Closing Headless Chrome")
  await browser.close();
})();
