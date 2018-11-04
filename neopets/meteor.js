const puppeteer = require('puppeteer');

module.exports["meteor"] = async (page) => {

  const whereto = "http://www.neopets.com/moon/meteor.phtml?getclose=1";

  console.log(`Page going to ${whereto}`);
  await page.goto(whereto);

  let present;


  try {

    console.log("Poking meteor with a stick");
    await page.$eval("select", sel => sel.value = "1");
    await page.click("input[name='meteorsubmit']");
    await page.waitForNavigation({waitUntil: "load"});

    present = true;

  } catch (err) {

    console.log("The Kreludor Meteor is unavailable", err);

  }

  if (present) {

    const date = new Date().toISOString().split("T")[0];
    const save_path = `dump/meteor/${date}_meteor_results.png`;
    console.log(`Saving meteor results as ${save_path}`);
    await page.screenshot({path: save_path});

  }

  return page;

};
