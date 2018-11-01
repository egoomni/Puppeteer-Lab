// https://developers.google.com/web/tools/puppeteer/get-started
require('dotenv').load();
const rl = require('readline-sync');
const slp = require('sleep-async')().Promise
const puppeteer = require('puppeteer');

const whereto = "http://www.neopets.com/lab2.phtml";

(async () => {

  console.log("Launching Headless Chrome");
<<<<<<< HEAD
  const browser = await neopets_login(
    process.env.NEOPETS_USERNAME,
    process.env.NEOPETS_PASSWORD
  );
=======
  const browser = await puppeteer.launch();
>>>>>>> parent of 765b839... Added login module and completed lab automation

  console.log("Browser initializing new page");
  const page = await browser.newPage();

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);
  console.log("Arrived at destination");

<<<<<<< HEAD
  let gimmeNeopet;

  if (process.env.MAIN_NEOPET) gimmeNeopet = process.env.MAIN_NEOPET;
  else {

    const neopets = await page.$$eval("input[type='radio']", radio_inputs => {
      const all_neopets = [...radio_inputs].map(el => el.value);
      return [...new Set(all_neopets)];
    });

    console.log(neopets);

    const neopet_index = rl.keyInSelect(neopets, "Which Neopet?");
    gimmeNeopet = neopets[neopet_index];

  }

  await page.evaluate((neopet) => document.querySelector(`input[type='radio'][value='${neopet}']`).checked = true, gimmeNeopet);

  await page.click(`input[type='radio'][value='${neopets[neopet_index]}']`);
  await page.click("input[type='submit'][value='Carry on with the Experiment!']");

  console.log(`Submitting ${gimmeNeopet} for lab treatment`);

  await page.waitForNavigation({waitUntil: "load"});

  const date = new Date().toISOString().split("T")[0];
  const save_path = `${date}_lab_results.png`;
  console.log(`Saving lab results to ${save_path}`);
  await page.screenshot({path: save_path});
=======
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
>>>>>>> parent of 765b839... Added login module and completed lab automation

  console.log("Closing Headless Chrome")
  await browser.close();

})();
