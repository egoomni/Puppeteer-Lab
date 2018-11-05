require('dotenv').load();
const fs = require('fs');
const puppeteer = require('puppeteer');
const neopets_login = require('./login.js');

let safetydeposit = {};

const whereto = "http://www.neopets.com/safetydeposit.phtml";

(async () => {

  const browser = await neopets_login(
    process.env.NEOPETS_USERNAME,
    process.env.NEOPETS_PASSWORD
  );

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  await page.goto(whereto);

  const item_amt = await page.$eval("td[colspan='2'][align='center']", td => {
    return td.textContent
      .split("|")[0]
      .replace(/\s|[a-zA-Z]|,|:/g, "");
  });

  for (let page_num = 0; page_num <= item_amt; page_num += 30) {

    await page.goto(`${whereto}?category=0&obj_name=&offset=${page_num}`);
    console.log(`${Math.floor(100 * page_num / item_amt)}%`);

    let items;

    try {

      items = await page.$eval("table[cellpadding='4']", tb => {
        return [...tb.children[0].children]
          .slice(3, 33)
          .map(tr => {
            let cells;
            try {
              cells = {
                name: tr.cells[1].textContent.replace(/\(.+\)/g, ""),
                type: tr.cells[3].textContent,
                quantity: Number(tr.cells[4].textContent)
              };
            } catch (err) {cells = {}};
            return cells;
          })
          .reduce((acc, cur) => {
            if (cur.name) {
              acc[cur.name] = cur;
              return acc;
            }
          }, {});
      });

    } catch (err) {console.log("Reached end of safety deposit box.");}


    if (items) {

      for (let item of Object.values(items)) {
        const {name} = item;
        const search_url = `https://items.jellyneo.net/search/?name=${name.replace(/\s/g, "+")}`;
        await page.goto(search_url);
        try {
          const price = await page.$eval(".text-small", p => Number(p.textContent.split(" NC")[0]));
          items[name]["price"] = price;
        } catch (err) {
          console.log(`No price listed for ${name}.`);
        }
      }

      safetydeposit = Object.assign(items, safetydeposit);

    }

  }

  safetydeposit = Object.entries(safetydeposit).sort().reduce((o, [k, v]) => (o[k] = v, o), {});
  const safetydeposit_json = JSON.stringify(safetydeposit, null, 2);

  const save_path = "dump/safetydeposit.json";
  fs.writeFileSync(save_path, safetydeposit_json);
  console.log(`Your safety deposit box has been successfully scraped and saved under ${save_path}`);

  await browser.close();

})();
