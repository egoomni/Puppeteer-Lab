const puppeteer = require('puppeteer');

module.exports["tdmbgpop"] = async (page, date) => {

  const whereto = "http://www.neopets.com/faerieland/tdmbgpop.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  try {

    console.log("Talking to the Plushie");
    await page.click("input[type='submit'][value='Talk to the Plushie']");

    console.log("Waiting for Plushie's response");
    await page.waitForNavigation({waitUntil: "load"});

    const save_path = `dump/tdmbgpop/${date}_tdmbgpop_results.png`;
    console.log(`Saving tdmbgpop results as ${save_path}`);
    await page.screenshot({path: save_path});

  } catch (err) {

    console.log("The Discarded Magical Blue Grundo Plushie of Prosperity is unavailable");

  }

  return page;

};
