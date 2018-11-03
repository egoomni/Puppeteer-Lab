const fs = require('fs');
const puppeteer = require('puppeteer');

module.exports["money_tree"] = async (page) => {

  const whereto = "http://www.neopets.com/donations.phtml";

  const date = new Date().toISOString().split("T")[0];
  const save_path = `dump/money_tree/${date}_money_tree_results.txt`;

  const max_attempts = 15;

  for (let i = 1; i <= max_attempts; i++) {

    console.log(`Page going to ${whereto}`);
    await page.goto(whereto);

    console.log(`Looking for donation #${i}`);

    let donation;

    try {

      donation = await page.$$eval(".donated", divs => {
        const el = divs[divs.length - 1];
        el.children[0].click();
        return el.children[1].innerText;
      });

      fs.appendFile(save_path, `${donation}\n`, err => {
        console.log(`Attemping to grab ${donation}`);
      });

    } catch (err) {

      console.log("No more donations");
      return page;

    }

  }

  return page;

};
