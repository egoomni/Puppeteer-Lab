const puppeteer = require('puppeteer');

module.exports["tombola"] = async (page, date) => {

  const whereto = "http://www.neopets.com/island/tombola.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  try {

    console.log("Playing Tombola");
    await page.click("input[type='submit'][value='Play Tombola!']");
    
    const save_path = `dump/tombola/${date}_tombola_results.png`;
    console.log(`Saving tombola results as ${save_path}`);
    await page.screenshot({path: save_path});

  } catch (err) {

    console.log("Tombola unavailable");

  }

  return page;

};
