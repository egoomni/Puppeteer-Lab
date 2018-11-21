const fs = require('fs');
const rl = require('readline-sync');
const puppeteer = require('puppeteer');
const yt = require('./yt.js');
const JSONDB = require('node-json-db');

// const save_path = `trending_${yt.get_iso_date()}`;
// const db = new JSONDB(save_path, true, false);

(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(await yt.channel(page, "UC3XTzVzaHQEd30rQbuvCtTQ"));

  process.exit();

})();
