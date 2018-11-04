const rl = require('readline-sync');
const puppeteer = require('puppeteer');

module.exports["lab"] = async (page, date) => {

  const whereto = "http://www.neopets.com/lab2.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  let gimmeNeopet = process.env.MAIN_NEOPET || 0;

  if (!gimmeNeopet) {

    try {

      const neopets = await page.$$eval("input[type='radio']", radio_inputs => {
        const all_neopets = [...radio_inputs].map(el => el.value);
        return [...new Set(all_neopets)];
      });

      const neopet_index = rl.keyInSelect(neopets, "Which Neopet?");
      gimmeNeopet = neopets[neopet_index];

    } catch (err) {

      console.log("Lab unavailable");
      return page;

    }

  }

  try {

    await page.evaluate((neopet) => document.querySelector(`input[type='radio'][value='${neopet}']`).checked = true, gimmeNeopet);

    await page.click(`input[type='radio'][value='${gimmeNeopet}']`);
    await page.click("input[type='submit'][value='Carry on with the Experiment!']");

    console.log(`Submitting ${gimmeNeopet} for lab treatment`);

    await page.waitForNavigation({waitUntil: "load"});
    
    const save_path = `dump/lab/${date}_lab_results.png`;
    console.log(`Saving lab results as ${save_path}`)
    await page.screenshot({path: save_path});

  } catch (err) {

    console.log("Lab unavailable");

  }

  return page;

};
