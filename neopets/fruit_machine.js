const puppeteer = require('puppeteer');

module.exports["fruit_machine"] = async (page) => {

  const whereto = "http://www.neopets.com/desert/fruit/index.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  try {

    console.log("Spinning the fruit machine");
    await page.click("input[type='submit'][value='Spin, spin, spin!']");

    console.log("Successfully spun the fruit machine");

  } catch (err) {

    console.log("Fruit Machine is not available");

  }

  return page;

};
