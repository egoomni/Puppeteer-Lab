require('dotenv').load();
const fs = require('fs');
const puppeteer = require('puppeteer');

const {insta_login} = require('./login.js');

const {like} = require('./like.js');

(async () => {

  console.log("Launching Headless Chrome");
  const browser = await insta_login(
    process.env.INSTA_USERNAME,
    process.env.INSTA_PASSWORD
  );

  console.log("Browser opening new tab");
  const page = await browser.newPage();

  await like(page, "Bk_SnGEn4ec");

  console.log("Welcome back to index.js");
  await browser.close();

})();
