const puppeteer = require('puppeteer');

module.exports["anchor"] = async (page) => {

  const whereto = "http://www.neopets.com/pirates/anchormanagement.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  console.log("Aiming cannon at seamonster");

  try {


    await page.$eval("#form-fire-cannon", form => form.submit());
    console.log("Successfully fired cannon at seamonster");

    const date = new Date().toISOString().split("T")[0];
    const save_path = `dump/anchor/${date}_anchor_results.png`;
    console.log(`Saving anchor management results as ${save_path}`);
    await page.screenshot({path: save_path});

  } catch (err) {

    console.log("Already defeated seamonster for today");

  }

  return page;

};
