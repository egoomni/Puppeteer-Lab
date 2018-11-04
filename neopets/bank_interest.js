const puppeteer = require('puppeteer');

module.exports["bank_interest"] = async (page) => {

  const whereto = "http://www.neopets.com/bank.phtml";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  console.log("Collecting bank interest");

  try {

    await page.$$eval("input[type='submit']", btns => btns[3].click());
    console.log("Successfully collected today's bank interest");

  } catch (err) {

    console.log("Already collected today's bank interest");

  }

  return page;

};
