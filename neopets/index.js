require('dotenv').load();
const fs = require('fs');
const puppeteer = require('puppeteer');

const helpers = require('./helpers.js');
const date = helpers.get_iso_date();

const neopets_login = require('./login.js');
const dailies = require('./dailies.js');

const Neopets_Stats = require('./neopets_stats.js');
const stats = new Neopets_Stats(`dump/stats/${date}.json`);

const Neopets_Progress = require('./neopets_progress.js');
const progress = new Neopets_Progress(`dump/progress/${date}.json`, dailies);

(async () => {

  console.log("Launching Headless Chrome");
  const browser = await neopets_login(
    process.env.NEOPETS_USERNAME,
    process.env.NEOPETS_PASSWORD
  );

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  await stats.beginStat(page);

  for (let [name, fn] of Object.entries(dailies)) {

    if (progress.is_finished(name)) continue;

    progress.finished(name);
    progress.save();

    await fn(page, date);

    await stats.updateStat(page);
    stats.save();

  }

  console.log("Your dailies have been completed!");
  await browser.close();

})();
