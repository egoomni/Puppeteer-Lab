require('dotenv').load();
const fs = require('fs');
const puppeteer = require('puppeteer');
const neopets_login = require('./login.js');


(async () => {

  const browser = await neopets_login(
    process.env.NEOPETS_USERNAME,
    process.env.NEOPETS_PASSWORD
  );

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  page.goto();

  console.log("Your dailies have been completed!");
  await browser.close();

})();
