require('dotenv').load();
const fs = require('fs');
const puppeteer = require('puppeteer');

const {neopets_login} = require('./login.js');

let neopet_functions = ["fruit_machine", "tombola", "lab", "fishing", "tdmbgpop", "money_tree", "meteor", "bank_interest", "anchor"]
  .reduce((acc, cur) => {
    acc[cur] = require(`./${cur}.js`)[cur];
    return acc;
  }, {});

let progress;

let gimme_date = new Date();
let date_offset = new Date().getTimezoneOffset();
gimme_date.setMinutes(gimme_date.getMinutes() - date_offset);
const date = gimme_date.toISOString().split("T")[0];
const progress_path = `dump/progress/${date}.json`;

if (fs.existsSync(progress_path)) {

  progress = JSON.parse(fs.readFileSync(progress_path));
  Object.entries(progress)
    .forEach(([name, bool]) => {
      if (bool)
        delete neopet_functions[name];
    });

} else {

  progress = Object.entries(neopet_functions)
    .reduce((acc, [name, fn]) => {
      acc[name] = false;
      return acc;
    }, {});

}

(async () => {

  console.log("Launching Headless Chrome");
  const browser = await neopets_login(
    process.env.NEOPETS_USERNAME,
    process.env.NEOPETS_PASSWORD
  );

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  for (let [name, fn] of Object.entries(neopet_functions)) {

    progress[name] = true;
    fs.writeFileSync(progress_path, JSON.stringify(progress));

    await fn(page, date);

  }

  console.log("Your dailies have been completed!");
  await browser.close();

})();
